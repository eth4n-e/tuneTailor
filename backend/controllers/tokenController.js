import { URLSearchParams } from 'url';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/userModel.js';
import mongoose from 'mongoose';

// client credentials / necessary data for spotify requests
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const clientSecret = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/login'; // url to redirect back to after authorization

/*************************************************************/
/** HELPER METHOD TO CHECK REFRESH TOKEN AND UPDATE DB USER */
export const updateTokenDB = async (user, token) => {
    user.accessToken = token.access_token;
    // refresh tokens are not always generated, in these instances default to the user's existing refreshToken
    user.refreshToken = token.refresh_token || user.refreshToken;
    // additions to Date.now() are in milliseconds
    // tokens last for 1 hour (3600 seconds or 3600 * 1000 milliseconds)
    user.tokenExpiration = Date.now() + token.expires_in * 1000;

    await user.save();
}
/** HELPER METHOD TO CHECK REFRESH TOKEN AND UPDATE DB USER */
/*************************************************************/

/***************************/
/** ACCESS TOKEN EXCHANGE **/
export const getAccessToken = async (code, codeVerifier) => {
    try {
        const tokenEndpoint = "https://accounts.spotify.com/api/token";
        // fetch does not support form property (reason behind using body property)
        // data must be application/w-xxx-form-urlencoded
        // URLSearchParams helps accomplish this
        const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                code: code,
                redirect_uri: REDIRECT_URI,
                code_verifier: codeVerifier,
            }),
        });
        return await tokenResponse.json();
    } catch(err) {
        throw new Error({error: 'Failed to retrieve access token'})
    }
}
/** ACCESS TOKEN EXCHANGE **/
/***************************/

/*******************/
/** REFRESH TOKEN **/
export const refreshToken = async (refreshToken) => {
    try {
        const endpoint = 'https://accounts.spotify.com/api/token';

        const updatedToken = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }).toString()
        });

        return await updatedToken.json();
    } catch (err) {
        throw new Error({error: 'Unable to refresh spotify token'});
    }
}
/** REFRESH TOKEN **/
/*******************/