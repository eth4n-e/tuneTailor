import express from 'express';
import  {
    redirectToSpotifyAuth,
} from '../controllers/authController.js';

import {
    getAccessToken,
} from '../controllers/tokenController.js';

import {
    getUserSession,
    updateUser,
    login
} from '../controllers/userController.js';

import { 
    fetchLikedSongs,
    fetchPlaylists,
    fetchTopTracks,
    deleteLikedSongs,
    deleteAllLikedSongs,
    addTracksToLikedSongs,
    addTracksFromPlaylistsToLikedSongs
} from '../controllers/musicController.js';

// use expresses router to handle all routes
const router = express.Router();

// configure route to be associated with particular controllers
router.post('/user/login', login);

router.post('/auth/redirectToSpotify', redirectToSpotifyAuth);

router.get('/user/getUser', getUserSession);

router.post('/music/fetchLikedSongs', fetchLikedSongs);

router.put('/user/updateUser', updateUser)

router.post('/music/fetchPlaylists', fetchPlaylists);

router.post('/music/fetchTopTracks', fetchTopTracks);

router.put('/music/addTracksToLikedSongs', addTracksToLikedSongs);

router.put('/music/addTracksFromPlaylistsToLikedSongs', addTracksFromPlaylistsToLikedSongs);

router.delete('/music/deleteLikedSongs', deleteLikedSongs);

router.delete('/music/deleteAllLikedSongs', deleteAllLikedSongs);

// export router for use in server.js
export default router;