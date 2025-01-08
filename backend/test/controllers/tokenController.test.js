import { app, startServer } from '../../server.js';
import supertest from 'supertest';
import { getAccessToken } from '../../controllers/tokenController.js';
import { createMockSuccessResponse, createMockErrorResponse } from '../utils/tokenUtils.js';

const MOCK_ACCESS_TOKEN = "mockAccessToken";
const MOCK_REFRESH_TOKEN = "mockRefreshToken";
const MOCK_CODE = "code";
const MOCK_CODE_VERIFIER = "codeVerifier";

// test get access token
describe('retrieving access token controller', () => {
    it('should request the spotify token endpoint and return the token successfully', async () => {
        const mockTokenData = {
            "access_token": MOCK_ACCESS_TOKEN,
            "token_type": "Bearer",
            "scope": "playlist-read-private",
            "expires_in": 1000,
            "refresh_token": MOCK_REFRESH_TOKEN,
        };

        // mock fetch such that the resolved value is the result of createMockSuccessResponse(mockTokenData);
        global.fetch = jest.fn().mockResolvedValue(
            createMockSuccessResponse(mockTokenData)
        )

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
        await expect(getAccessToken(MOCK_CODE, MOCK_CODE_VERIFIER)).rejects.toThrow(Error);
    })
})
// test get refresh token
// test updateTokenDB
