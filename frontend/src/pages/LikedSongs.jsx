import { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import NavBar from '../components/NavBar';
import TrackCard from '../components/TrackCard';
import axios from 'axios';
import { socket } from '../utils/socket.js'
import { createHandleCardClick } from '../utils/helpers';
import ClickedTrackCard from '../components/ClickedTrackCard';

const LikedSongs = () => {
    const user = useLoaderData();
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    const [clickedTracks, setClickedTracks] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    // fetch data submitted by login form

    useEffect( () => {
        const fetchTracks = async () => {
            try {
                // const LIMIT = 50;
                // let endpoint = `https://api.spotify.com/v1/me/tracks?limit=${LIMIT}`

                // while(hasMore) {
                //     const fetchedTracks = await axios.post('/api/music/fetchLikedSongs', {
                //         user,
                //         endpoint,
                //     });

                //     if (fetchedTracks.data.nextPage !== null) {
                //         endpoint = fetchedTracks.data.nextPage;
                //         const extractedTracks = fetchedTracks.data.tracks;
                //         // ensures that as more tracks are retrieved they are rendered under
                //         setTracks((prevTracks) => [...prevTracks, ...extractedTracks]);
                //     } else {
                //         setHasMore(false);
                //     }
                // }
                socket.on('likedSongsChunk', (tracks) => {
                    console.log(tracks);
                    setTracks((prevTracks) => [...prevTracks, tracks]);
                })
            } catch(err) {
                console.error('Error fetching tracks: ', err);
            }
        }

        fetchTracks();
    }, [user])

    const handleCardClick = createHandleCardClick(setClickedTracks);

    return (
        <div className="w-100 bg-beige">
            <NavBar user={user} itemIds={clickedTracks} setClickedCards={setClickedTracks} setTracks={setTracks}/>
            <div className='mt-4 mx-4 pb-4 grid grid-cols-4 gap-6'>
                {
                    tracks && (tracks.map( (track) => (
                        clickedTracks.includes(track.id) ? (
                            <ClickedTrackCard track={track} handleCardClick={handleCardClick} key={track.id}/>
                        ) : (
                            <TrackCard track={track} handleCardClick={handleCardClick} key={track.id}/>
                        )
                    )))
                }
            </div>
        </div>
    )

}

export default LikedSongs