import NavBar from "../components/NavBar";
import TrackCard from "../components/TrackCard";
import ClickedTrackCard from "../components/ClickedTrackCard.jsx";
import { useLoaderData } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { createHandleCardClick } from '../utils/helpers.js';

const TopTracks = () => {
    const user = useLoaderData();
    const [topTracks, setTopTracks] = useState([]);
    const [clickedTracks, setClickedTracks] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect( () => {
        const fetchTopTracks = async (user) => {
            try {
                const TIME_RANGE = 'long_term';
                const LIMIT = 50;
                const TOP_ITEM = 'tracks';
                let endpoint = `https://api.spotify.com/v1/me/top/${TOP_ITEM}?time_range=${TIME_RANGE}&limit=${LIMIT}`;
                const TRACK_AMOUNT = 1000;

                while(hasMore && topTracks.length < TRACK_AMOUNT) {
                    const fetchedTracks = await axios.post('/api/music/fetchTopTracks', {
                        user,
                        endpoint,
                    });

                    console.log(fetchedTracks);

                    if (fetchedTracks.data.nextPage !== null) {
                        endpoint = fetchedTracks.data.nextPage;
                        const extractedTracks = fetchedTracks.data.tracks;
                        // ensures that as more tracks are retrieved they are rendered under
                        setTopTracks((prevTracks) => [...prevTracks, ...extractedTracks]);
                    } else {
                        setHasMore(false);
                    }
                }

                console.log(topTracks);
            } catch(err) {
                console.error('Error fetching tracks: ', err);
            }    
        }

        fetchTopTracks(user);
    }, [user]);

    const handleCardClick = createHandleCardClick(setClickedTracks);

    return (
        <div className="w-100 bg-beige">
            <NavBar user={user} itemIds={clickedTracks} setClickedCards={setClickedTracks}/>
            <div className='mt-6 pb-4 mx-4 grid grid-cols-4 gap-6'>
                {
                    topTracks && (topTracks.map( (track) => (
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

export default TopTracks