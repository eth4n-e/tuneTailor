import supertest from 'supertest';
import { generateRandomString } from '../../utils/helpers';
import { app } from '../../server.js';
/* Notes
- describe / it syntax is used to group related tests together
- within a describe block, each it block represents an individual test case
- test syntax is essentially the same as it
- using test syntax here because it is already clear that I will be testing the functionality of my authControllers
*/
// let server;

afterEach(() => {
    jest.clearAllMocks();
})

test('POST /api/auth/redirectToSpotify', async () => {
    try {
        const codeChallenge = generateRandomString(64);

        const response = await supertest(app)
                    .post('/api/auth/redirectToSpotify')
                    .send({codeChallenge: codeChallenge})
                    .expect(200);

        const responseUrl = new URL(response.body.auth_data);
        const queryParams = new URLSearchParams(responseUrl.search);

        // required query params to redirect to spotify
        expect(queryParams.get('response_type')).toBe('code');
        expect(queryParams.get('code_challenge_method')).toBe('S256'); // PKCE flow uses SHA256 algorithm
        expect(queryParams.get('client_id')).toBeDefined();
        expect(queryParams.get('redirect_uri')).toBeDefined();
        expect(queryParams.get('code_challenge')).toBeDefined();
    } catch (error) {
        console.error(error);
    }
});