import { app, startServer } from '../../server.js';
import supertest from 'supertest';
import { getAccessToken, refreshToken } from '../../controllers/tokenController.js';
import { createMockSuccessResponse, createMockErrorResponse } from '../utils/tokenUtils.js';

const MOCK_ACCESS_TOKEN = "mockAccessToken";
const MOCK_REFRESH_TOKEN = "mockRefreshToken";
const MOCK_CODE = "code";
const MOCK_CODE_VERIFIER = "codeVerifier";
const TOKEN_TIME_LIMIT = 3600;

afterEach(() => {
    jest.clearAllMocks();
})

describe('retrieving access token controller', () => {
    it('should request the spotify token endpoint and return the token successfully', async () => {
        const MOCK_TOKEN_DATA = {
            "access_token": MOCK_ACCESS_TOKEN,
            "token_type": "Bearer",
            "scope": "playlist-read-private",
            "expires_in": TOKEN_TIME_LIMIT,
            "refresh_token": MOCK_REFRESH_TOKEN,
        }
        // mock fetch such that the resolved value is the result of createMockSuccessResponse(mockTokenData);
        global.fetch = jest.fn().mockResolvedValue(
            createMockSuccessResponse(MOCK_TOKEN_DATA)
        );

        const getTokenResponse = await getAccessToken(MOCK_CODE, MOCK_CODE_VERIFIER);

        expect(getTokenResponse).toHaveProperty('access_token');
        expect(getTokenResponse).toHaveProperty('expires_in');
        expect(getTokenResponse.expires_in).not.toBeNaN();
        expect(getTokenResponse).toHaveProperty('refresh_token');
    });

    it('should throw an error upon an unsuccessful request', async () => {
        global.fetch = jest.fn().mockResolvedValue(
            createMockErrorResponse()
        )
        // note: .rejects is used to assert that a Promise rejects (fails)
        await expect(getAccessToken(MOCK_CODE, MOCK_CODE_VERIFIER)).rejects.toThrow(Error);
    })
});

describe('refreshing access tokens', () => {
    it('should request the spotify refresh token endpoint and update the access token', async () => {
        const MOCK_TOKEN_DATA_BEFORE_REFRESH = {
            "access_token": MOCK_ACCESS_TOKEN,
            "token_type": "Bearer",
            "scope": "playlist-read-private",
            "expires_in": 0,
            "refresh_token": MOCK_REFRESH_TOKEN,
        }

        const MOCK_TOKEN_DATA_AFTER_REFRESH = {
            "access_token": "updatedAccessToken",
            "token_type": "Bearer",
            "scope": "playlist-read-private",
            "expires_in": TOKEN_TIME_LIMIT,
            "refresh_token": MOCK_REFRESH_TOKEN,
        }
        
        global.fetch = jest.fn().mockResolvedValue(
            createMockSuccessResponse(MOCK_TOKEN_DATA_AFTER_REFRESH)
        );
 
        const refreshResponse = await refreshToken(MOCK_TOKEN_DATA_BEFORE_REFRESH.refresh_token);

        expect(refreshResponse).toHaveProperty('access_token');
        // new access token should be generated
        expect(refreshResponse.access_token).not.toEqual(MOCK_TOKEN_DATA_BEFORE_REFRESH.access_token);
        expect(refreshResponse).toHaveProperty('refresh_token');
        // refresh tokens do not change with this request, only after re-authorization
        expect(refreshResponse.refresh_token).toEqual(MOCK_TOKEN_DATA_BEFORE_REFRESH.refresh_token);
        expect(refreshResponse).toHaveProperty('expires_in');
        // access tokens are refreshed with a time limit of 1 hour = 3600 seconds
        expect(refreshResponse.expires_in).toEqual(TOKEN_TIME_LIMIT);
    });

    it('should throw an error upon an unsuccessful request', async() => {
        global.fetch = jest.fn().mockResolvedValue(
            createMockErrorResponse()
        );

        const invalidRefreshToken = null;

        await expect(refreshToken(invalidRefreshToken)).rejects.toThrow(Error);
    }); 
})
// test updateTokenDB
