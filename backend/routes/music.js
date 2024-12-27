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
router.post('/login', login);

router.post('/auth', redirectToSpotifyAuth);

router.get('/getUser', getUserSession);

router.post('/fetchLikedSongs', fetchLikedSongs);

router.put('/updateUser', updateUser)

router.post('/fetchPlaylists', fetchPlaylists);

router.post('/fetchTopTracks', fetchTopTracks);

router.put('/addTracksToLikedSongs', addTracksToLikedSongs);

router.put('/addTracksFromPlaylistsToLikedSongs', addTracksFromPlaylistsToLikedSongs);

router.delete('/deleteLikedSongs', deleteLikedSongs);

router.delete('/deleteAllLikedSongs', deleteAllLikedSongs);

// export router for use in server.js
export default router;