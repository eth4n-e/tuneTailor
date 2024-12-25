import { addTracksToLikedSongsHelper, deleteLikedSongsHelper, getPlaylistItems } from '../utils/helpers.js';
import pLimit from 'p-limit';

// Purpose: implement the functionality of the routes, keep music.js (file for routes) clean
/***********************/
/** FETCH LIKED SONGS **/
const fetchLikedSongs = async (req, res) => {
    try {
        const token = req.body.user.accessToken;
        const endpoint = req.body.endpoint;
        let tracks;

        const trackData = await fetch(endpoint, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }).then(response => response.json());

        if (trackData.items !== undefined) {
            tracks = trackData.items.map(item => item.track);
        }

        res.status(201).json({
            tracks: tracks,
            nextPage: trackData.next
        }); 
    } catch (err) {
        console.error(err);
    }
}
/** FETCH LIKED SONGS **/
/***********************/

/*********************/
/** FETCH PLAYLISTS **/
const fetchPlaylists = async (req, res) => {
    const user = req.body.user;

    try {
        let playlistEndpoint = `https://api.spotify.com/v1/users/${user._id}/playlists`;

        const playlistResponse = await fetch(playlistEndpoint, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + user.accessToken
            }
        });

        const playlistData = await playlistResponse.json();

        return res.status(200).json({playlists: playlistData});
    }  catch (err) {
        console.log(err);
        res.status(401).json({error: "Unable to fetch user's playlists"});
    }
}

/** FETCH PLAYLISTS **/
/*********************/

/**********************/
/** FETCH TOP TRACKS **/
const fetchTopTracks = async (req, res) => {
    try {
        const token = req.body.user.accessToken;
        const endpoint = req.body.endpoint;
        let tracks;

        const trackData = await fetch(endpoint, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }).then(response => response.json());

        if (trackData.items !== undefined) {
            tracks = trackData.items;
        }

        res.status(201).json({
            tracks: tracks,
            nextPage: trackData.next
        }); 
    } catch(err) {
        console.log(err);
        res.status(401).json({error: "Unable to fetch user's top tracks"});
    }
}

// const paginateTopTracks = async (endpoint, token, trackAmount) => {
//     try {
//         let tracks = []

//         // retrieve top1000 tracks from different pages
//         while(endpoint && tracks.length < trackAmount) {
//             const trackResponse = await fetch(endpoint, {
//                 method: "GET",
//                 headers: {
//                   Authorization: 'Bearer ' + token  
//                 }
//             })
    
//             const trackData = await trackResponse.json();

//             // next stores endpoint to next page of tracks
//             endpoint = trackData.next;

//             tracks = tracks.concat(trackData.items);
//         }

//         return tracks;
//     } catch(err) {
//         throw new Error({error: 'Unable to retrieve list of top tracks'});
//     }
// }
/** FETCH TOP TRACKS **/
/**********************/

/************************/
/** DELETE LIKED SONGS **/
const deleteLikedSongs = async (req, res) => {
    try {
        let trackIds = req.body.idList;
        let token = req.body.user.accessToken;
       
        const deleteResponse = await deleteLikedSongsHelper(token, trackIds);

        res.status(200).json({"message": "Tracks successfully removed from liked songs"});
    } catch (err) {
        console.error(err);
    }
}

const deleteAllLikedSongs = async (req, res) => {
    try {
        let token = req.body.user.token;

    } catch (err) {
        console.error(err);
    }
}
/** DELETE LIKED SONGS **/
/************************/

/****************/
/** ADD TRACKS **/
const addTracksToLikedSongs = async (req, res) => {
    try {
        let trackIds = req.body.idList;
        let token = req.body.user.accessToken;
        
        const addResult = await addTracksToLikedSongsHelper(token, trackIds);

        res.status(201).json({"message": "Tracks successfully added to liked songs"});
    } catch (err) {
        console.error(err);
    }
}

const addAllTracksToLikedSongs = async (req, res) => {

}
/** ADD TRACKS **/
/****************/

/*******************/
/** ADD PLAYLISTS **/
const addTracksFromPlaylistsToLikedSongs = async (req, res) => {
    try {
        let playlistIds = req.body.itemIds;
        let token = req.body.user.accessToken;
  
        // allPlaylistItems is a list of lists containing track ids for each playlist
        const allPlaylistItems = await Promise.allSettled(playlistIds.map(id => getPlaylistItems(token, id)));

        // result was coming back as 2D array, addTracksToLikedSongsHelper expects a 1D array to perform chunking
        const allTrackIds = allPlaylistItems.map(playlistItem => playlistItem.value.flat());

        const addResult = await addTracksToLikedSongsHelper(token, allTrackIds);

        res.status(201).json({"message": "Tracks from each playlist have been added to liked songs"});
    } catch(err) {
        console.error(err);
    }
}

const addTracksFromAllPlaylists = async (req, res) => {

}
/** ADD PLAYLISTS **/
/*******************/

export {
    fetchLikedSongs,
    fetchPlaylists,
    fetchTopTracks,
    addTracksToLikedSongs,
    deleteLikedSongs,
    deleteAllLikedSongs,
    addTracksFromPlaylistsToLikedSongs,
}