import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import NavBar from '../components/NavBar';
import TrackCard from '../components/TrackCard';
import axios from 'axios';
import { socket } from '../utils/socket.js'
import { createHandleCardClick } from '../utils/helpers';
import ClickedTrackCard from '../components/ClickedTrackCard';


// possible infinite scroll to allow for tracks to be requested only when user scrolls to bottom
// const handleScroll = (event) => {
//     const { scrollTop, scrollHeight, clientHeight } = event.target;
//     if (scrollHeight - scrollTop <= clientHeight) {
//         // Request the next chunk when scrolled to the bottom
//         socket.emit('requestLikedSongs', userId);
//     }
// };

// return (
//     <div onScroll={handleScroll}>
//         {tracks.map((track) => (
//             <TrackCard key={track.id} track={track} handleCardClick={handleCardClick} />
//         ))}
//     </div>
// );


const LikedSongs = () => {
    const user = useLoaderData();
    const [tracks, setTracks] = useState([]);
    const [clickedTracks, setClickedTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {
        const fetchTracks = async () => {
            try {
                socket.on('likedSongsChunk', (trackChunk) => {
                    setTracks((prevTracks) => [...prevTracks, ...trackChunk]);
                    setIsLoading(false);
                });

                return () => {
                    socket.off('likedSongsChunk');
                }
            } catch(err) {
                console.error('Error fetching tracks: ', err);
            }
        }

        fetchTracks();
    }, [user])

    const handleCardClick = createHandleCardClick(setClickedTracks);

    return (
    <div className="w-100 bg-beige">
        { isLoading ? (
            <div>Liked Songs are loading...</div>
        ) : (
            <>
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
            </>
        )
        }  
    </div>
    )
}

export default LikedSongs