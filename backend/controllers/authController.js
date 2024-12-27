import querystring from 'querystring';
import dotenv from 'dotenv';
dotenv.config();
import { generateRandomString } from '../utils/helpers.js';

// client credentials / necessary data for spotify requests
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = 'http://localhost:3000/login'; // url to redirect back to after authorization

/*******************/
/** AUTHORIZATION **/
export const redirectToSpotifyAuth = async (req, res) => {
    const codeChallenge = req.body.codeChallenge;
    // protection against attacks
    const state = generateRandomString(16).trimStart();
    // spotify functionality we want to access
    const scopes = 'user-read-private user-read-email playlist-modify-private playlist-modify-public playlist-read-collaborative user-top-read user-library-modify user-library-read';

    // pass the authorization url to the frontend
    // frontend handles redirect to spotify's authorization page
    try {
        const queryParams = querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scopes,
            redirect_uri: REDIRECT_URI,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            show_dialog: true,
        });

        const authorize_url = `https://accounts.spotify.com/authorize?${queryParams}`;
        return res.status(200).json({auth_data: authorize_url});
    } catch(err) {
        console.log(err);
        res.status(500).json({'error': err});
    }
}
/** AUTHORIZATION **/
/*******************/