import { addTracksToLikedSongsHelper, paginateLikedSongs, deleteLikedSongsHelper, getPlaylistItems } from '../utils/helpers.js';

// Purpose: implement the functionality of the routes, keep music.js (file for routes) clean
/***********************/
/** FETCH LIKED SONGS **/
export const fetchLikedSongs = async (req, res) => {
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
export const fetchPlaylists = async (req, res) => {
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
export const fetchTopTracks = async (req, res) => {
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
/** FETCH TOP TRACKS **/
/**********************/

/************************/
/** DELETE LIKED SONGS **/
export const deleteLikedSongs = async (req, res) => {
    try {
        let trackIds = req.body.idList;
        let token = req.body.user.accessToken;
       
        const deleteResponse = await deleteLikedSongsHelper(token, trackIds);

        res.status(200).json({"message": "Tracks successfully removed from liked songs"});
    } catch (err) {
        console.error(err);
    }
}

export const deleteAllLikedSongs = async (req, res) => {
    try {
        let token = req.body.token;
        const fetchedTracks = await paginateLikedSongs(token);
        console.log("Fetched Tracks: ", fetchedTracks);
        const trackIds = fetchedTracks.items.map(item => item.track.id);

        console.log(trackIds);
        const deleteResponse = await deleteLikedSongsHelper(token, trackIds);

        res.status(200).json({"message": "Deleted all liked songs successfully"});
    } catch (err) {
        console.error(err);
    }
}
/** DELETE LIKED SONGS **/
/************************/

/****************/
/** ADD TRACKS **/
export const addTracksToLikedSongs = async (req, res) => {
    try {
        let trackIds = req.body.itemIds;
        let token = req.body.user.accessToken;
        
        const addResult = await addTracksToLikedSongsHelper(token, trackIds);

        res.status(201).json({"message": "Tracks successfully added to liked songs"});
    } catch (err) {
        console.error(err);
    }
}

export const addAllTracksToLikedSongs = async (req, res) => {

}
/** ADD TRACKS **/
/****************/

/*******************/
/** ADD PLAYLISTS **/
export const addTracksFromPlaylistsToLikedSongs = async (req, res) => {
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

export const addTracksFromAllPlaylists = async (req, res) => {

}
/** ADD PLAYLISTS **/
/*******************/