import supertest from 'supertest'
import { createMockErrorResponse, createMockSuccessResponse } from '../utils/tokenUtils';
import { app } from '../../server.js';
import { 
    fetchLikedSongs, 
    fetchTopTracks, 
    fetchPlaylists,
    addTracksToLikedSongs,
    addAllTracksToLikedSongs,
    addTracksFromAllPlaylists,
    deleteLikedSongs,
    deleteAllLikedSongs
} from '../../controllers/musicController';

const MOCK_SPOTIFY_ENDPOINT = "spotifyEndpoint";
const MOCK_USER = {
    "_id": "userId123",
    "name": "ethan", 
    "email": "ethan.gmail.com",
    "password": "pandas124",
    "profilePic": "profile.jpeg",
    "accessToken": "mockAccessToken",
    "refreshToken": "mockRefreshToken",
    "tokenExpiration": Date.now() + 3600 * 1000,
}

const MOCK_TRACK = {
    "album": {
      "id": "2up3OPMp9Tb4dAKM2erWXQ",
      "images": [
        {
          "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
          "height": 300,
          "width": 300
        }
      ],
    },
    "artists": [
      {
        "name": "coolArtistName",
      }
    ],
    "href": "string",
    "id": "coolTrackId",
    "name": "coolTrack",
}

describe('POST /api/music/fetchLikedSongs', () => {
    it('should fetch 50 liked songs of a user on a successful request', async () => {
        const MOCK_TRACKSET = {
            "next": "nextUrl",
            "offset": 0,
            "items": new Array(50).fill({
                "added_at": new Date(),
                "track": {
                    ...MOCK_TRACK
                }
            })
        };

        global.fetch = jest.fn().mockResolvedValue(
            createMockSuccessResponse(MOCK_TRACKSET)
        );
        
        const response = await supertest(app)
                            .post('/api/music/fetchLikedSongs')
                            .send({
                                user: MOCK_USER,
                                endpoint: MOCK_SPOTIFY_ENDPOINT,
                            })
                            .expect(200);

        const fetchedTracks = response.body;
        expect(fetchedTracks).toHaveProperty("tracks");
        expect(fetchedTracks).toHaveProperty("nextPage");
        
        const tracks = fetchedTracks.tracks;
        expect(tracks.length).toEqual(MOCK_TRACKSET.items.length);
        const firstTrack = tracks[0];
        expect(firstTrack).toHaveProperty("album");
        expect(firstTrack.album).toHaveProperty("images");
        expect(firstTrack).toHaveProperty("artists");
        expect(firstTrack).toHaveProperty("name");
        expect(firstTrack).toHaveProperty("id");
    });
});

test('POST /api/music/fetchTopTracks', async () => {

});

test('POST /api/music/fetchPlaylists', async () => {

});

test('PUT /api/music/addTracksToLikedSongs', async () => {

});

test('PUT /api/music/addTracksFromPlaylistsToLikedSongs', async () => {

});

test('DELETE /api/music/deleteLikedSongs', async () => {

});

test('DELETE /api/music/deleteAllLikedSongs', async () => {

});