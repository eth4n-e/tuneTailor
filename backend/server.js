// get access to .env variables
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import router from './routes/music.js';
import session from 'express-session';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
// create express app
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000'
}

// middleware setup
// cross-origin resource sharing
    // ensures safe access to data / resources
    // determines which origins (protocol, hostname, port) can access resources / have permission
    // e.g. define localhost as origin, only localhost can get data / access backend resources
app.use(cors(corsOptions));
    
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

// database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests only after successfully connecting 
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT);
        });
    }).catch((err) => {
        console.log(err)
});


const server = createServer(app);
const io = new Server(server);
// structure: io.on( event, (connectionBetweenServerAndClient) => {
//      ... handle events 
// })
// io is used to maintain connection between server and client
// allows server to respond to events initiated by client where socket param represents the specific connection
io.on('connection', (socket) => {
    console.log('User connected');
})