// get access to .env variables
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import LikedSongs from './models/likedSongsModel.js'
import router from './routes/music.js';
import session from 'express-session';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
// create express app
const app = express();
const server = createServer(app);
// socket io requires enabling cors, essentially allows for requests / connections from the provided origin (frontend)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});
    
// use MongoDB to store sessions
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
});

// setup sessions
app.use(
    session({
      secret: process.env.SESSION_SECRET, // Replace with a strong secret key
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: { secure: false } // Set to true if using HTTPS
    })
);

// parse data sent in request into json
app.use(express.json());

app.use((req, res, next) => {
    // log path and request method
    // console.log(req.path, req.method);
    // transfer to next request / middleware function
    next();
})

// use routes defined in music.js
app.use('/api/music', router);

// io represents the socket.io server listening to all incoming connections from clients
// it is built on top of the http server and handles WebSocket events
// the socket parameter represents the connection between an individual client and the server
// used to manage communication with that specific client
io.on('connection', (socket) => {
    console.log("User connected: ", socket.id);

    socket.on('startProcessingLikedSongs', async (user) => {
        console.log("startProcessing user: ", user);
        /* Structure
        - Want a singular controller / method to handle
            1) paginating a user's liked songs
            2) saving tracks to liked songs collection
        Flow
        
        while(endpoint) {
            1) make request to spotify for 50 tracks
            2 / 3) save these 50 tracks to db
            2 / 3) emit an event whose data is the retrieved tracks
        }
        
        on the frontend:
        - listen for the event to be emitted by the server
        - when the event occurs add the tracks to my state holding a users liked songs
        */
        const USER_ID = user._id;
        const token = user.accessToken;
        const LIMIT = 50;
        let trackItems;
        let tracks = [];
        let trackEndpoint = `https://api.spotify.com/v1/me/tracks?limit=${LIMIT}`;
        // responses from Get User's Saved Tracks contains a next key which points to next endpoint
        // next endpoint for last page of tracks is null
        while(trackEndpoint) {
            let trackData = await fetch(trackEndpoint, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', 
                }
            }).then(response => response.json());
    
            if(trackData.items !== undefined) {
                trackItems = trackData.items;
                trackEndpoint = trackData.next;
            }

            trackItems.forEach(async (item) => {
                console.log('Track item', item);

                const addedAt = item.added_at;
                const track = item.track;
                const trackId = track.id;
                const songName = track.name;
                const imageURL = track.album.images[0].url;
                const artistName = track.artists[0].name;

                await LikedSongs.create({
                    userId: USER_ID,
                    trackId: trackId,
                    songName: songName,
                    imageURL: imageURL,
                    artistName: artistName,
                    addedAt: addedAt,
                });

                tracks.push(track);
            });

            socket.emit('likedSongsChunk', tracks);
        }
    })
});

// database connection and starting http server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests only after successfully connecting 
        server.listen(process.env.PORT, () => {
            console.log('connected to DB and started http server at port', process.env.PORT);
        });
    }).catch((err) => {
        console.log(err)
});

