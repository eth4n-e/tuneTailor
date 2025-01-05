import supertest from 'supertest';
import { generateRandomString } from '../../utils/helpers';
import { app, startServer } from '../../server.js';
/* Notes
- describe / it syntax is used to group related tests together
- within a describe block, each it block represents an individual test case
- test syntax is essentially the same as it
- using test syntax here because it is already clear that I will be testing the functionality of my authControllers
*/
let server;

beforeAll(async () => {
    server = await startServer();
});

test('POST /api/auth/redirectToSpotify', async () => {
    const codeChallenge = generateRandomString(64);

    await supertest(app)
                .post('/api/auth/redirectToSpotify')
                .send({codeChallenge: codeChallenge})
                .expect(200)
                .then(response => {
                    console.log(response);
                    // get the the query parameters from the url
                    // assert that it has things like the codeChallenge, scopes, etc. present 
                    // assert that it has all necessary information to perform the request / redirect
                })
});

afterAll(async () => {
    await server.close();
});