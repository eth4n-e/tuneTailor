import { supertest } from 'supertest';
import { generateRandomString } from '../../utils/helpers';
import { app } from '../../server.js';
/* Notes
- describe / it syntax is used to group related tests together
- within a describe block, each it block represents an individual test case
- test syntax is essentially the same as it
- using test syntax here because it is already clear that I will be testing the functionality of my authControllers
*/
test('POST /api/auth/redirectToSpotify', async () => {
    // make the request to my controller
    // this will involve creating a mock code challenge
    // assert that the response code is 200
    // the controller should return the authorization url needed to make the redirect
    // check that the url has specific properties like the redirect_uri
        // maybe check for all the query params
    const codeChallenge = generateRandomString(64);

    await supertest(app)
                .post('/api/auth/redirectToSpotify')
                .send({codeChallenge: codeChallenge})
                .expect(200)
                .then(response => {
                    console.log(response);
                })
});