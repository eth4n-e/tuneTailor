import ClickedCard from "./ClickedTrackCard";

const TrackCard = ({track, handleCardClick}) => {
    if(track.album.images[0] === undefined) {
        console.log("Track with undefined images: ", track);
    }
    console.log('Track card', track);

    return (
        <div onClick={() => handleCardClick(track.id)} className="overflow-x-hidden rounded-md p-2 bg-beige2 shadow-lg shadow-brown3 transition ease-in-out duration-500 hover:-translate-y-1 hover:bg-beige1 hover:shadow-md hover:shadow-brown2 hover:border hover:border-brown1">
            <img className="object-cover rounded-md drop-shadow-xl " src={track.album.images[0]?.url} alt="Track cover"/>
            <p className="text-center mt-2 text-brown3 font-semibold">{track.name} by {track.artists[0].name}</p>
        </div>  
    );
}

export default TrackCard;