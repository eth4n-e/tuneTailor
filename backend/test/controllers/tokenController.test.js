import { app, startServer } from '../../server.js';
import supertest from 'supertest';

let server;

beforeAll( async () => {
    server = await startServer();
});

// test get access token
describe('retrieving access token controller', () => {
    it('should request the spotify token endpoint and return the token', async () => {
        // thinking that I will need to make a mock here because I want to avoid making requests to the actual spotify endpoint
        
        expect(response).toHaveProperty('access_token');
        expect(response).toHaveProperty('expires_in');
        expect(response).toHaveProperty('refresh_token');
    })
})
// test get refresh token
// test updateTokenDB

afterAll(async () => {
    await server.close();
})