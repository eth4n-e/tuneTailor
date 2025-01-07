import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpotify} from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

const Auth = () => {

    // generateRandomString, sha256, base64encode methods for PKCE flow provided by Spotify
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    const sha256 = async (plain) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
      }
      
    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    } 

    const handleAuth = async (e) => {
            e.preventDefault();
          
            try {
                // used for PKCE flow
                const codeVerifier = generateRandomString(64).trimStart();

                // save codeVerifier for next step of PKCE Flow (requesting access token)
                localStorage.setItem('code_verifier', codeVerifier);
                const hashed = await sha256(codeVerifier);
                const codeChallenge = base64encode(hashed).trimStart();

                // make request to server to receive back the spotify authorization url
                const response = await axios.post('/api/auth/redirectToSpotify', { 
                    headers: {
                        'Access-Control-Allow-Origin': 'http://localhost:3000/',
                    }, codeChallenge });
                const authorize_url = response.data.auth_data;
                window.location.href = authorize_url; 
            } catch(err) {
                console.log(err);
            }
    }
    //change to frontend
    return (
        <form onSubmit={handleAuth}>
            <div className="absolute bottom-0 left-0 bg-beige size-full p-0 mx-auto">
                <div className='relative top-1/4 bg-brown3 backdrop-saturate-2 shadow-inner drop-shadow-xl w-8/12 h-3/6 mx-auto rounded-xl text-center border-2 border-brown2'>
                    <header className="bg-beige drop-shadow-xl rounded-t-xl">
                        <h1 className='py-6 font-bold text-xl text-brown3'>Authorize Via Spotify</h1>
                    </header>
                    <FontAwesomeIcon icon={faSpotify} size="8x" className='mt-16 text-beige'/>
                    <button type="submit" value="submit" className="block p-2 bg-beige mx-auto rounded-xl text-brown-3 mt-10 font-bold">Proceed</button>
                </div>
            </div>
        </form>
    );
}

export default Auth