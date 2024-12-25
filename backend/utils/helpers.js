const chunkArray = (array, chunkSize) => {
    const result = [];
    for(let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
  
    return result;
}

const addTracksToLikedSongsHelper = async (token, trackIds) => {
  try { 
    const CHUNK_SIZE = 50;
    let chunkedTracks = chunkArray(trackIds, CHUNK_SIZE);

    // APIReq can only handle trackBatches of <= 50
    // Promise.allSettled enables resolving each APIReq
      // (returns a promise because it is an async method, will resolve to result - Response object from the request to spotify api)
    const result = await Promise.allSettled(chunkedTracks.map(chunk => addTracksToLikedSongsAPIReq(token, chunk)));
    
    return result;
  } catch(err) {
    console.error(err);
  }
}

// handle making the request to spotify to add tracks
const addTracksToLikedSongsAPIReq = async (token, trackBatch) => {
  try {
      // TO-DO: think about adding a request to https://api.spotify.com/v1/me/tracks/contains so I'm only adding new tracks to liked songs
      let trackEndpoint = `https://api.spotify.com/v1/me/tracks?ids=${trackBatch}`;
      const result = await fetch(trackEndpoint, {
          method: 'PUT',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          }
      });

      return result;
  } catch (err) {
    console.error(err);
  }
} 

const deleteLikedSongsHelper = async (token, trackIds) => {
  try { 
    const CHUNK_SIZE = 50;
    let chunkedTracks = chunkArray(trackIds, CHUNK_SIZE);

    const result = await Promise.allSettled(chunkedTracks.map(chunk => deleteLikedSongsAPIReq(token, chunk)));
    
    return result;
  } catch(err) {
    console.error(err);
  }
}

const deleteLikedSongsAPIReq = async (token, trackBatch) => {
  try {
    let trackEndpoint = `https://api.spotify.com/v1/me/tracks?ids=${trackBatch}`;
    const result = await fetch(trackEndpoint, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    }).then(response => response.json());

    return result;
  } catch (err) {
    console.error(err);
  }
}

// paginate the request for getting a playlist's items
const getPlaylistItems = async (token, id) => {
  try {
    let tracks = [];
    let endpoint = `https://api.spotify.com/v1/playlists/${id}/tracks`;

    while(endpoint) {
      let getPlaylistItems = await fetch(endpoint, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      let playlistData = await getPlaylistItems.json();
      let trackIds = playlistData.items.map(item => item.track.id);
      // my requests for adding liked songs only rely on the track id so the above line creates a new list with only the track ids
      tracks.push(trackIds);
      endpoint = playlistData.nextl
    }

    return tracks;

  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  addTracksToLikedSongsHelper,
  deleteLikedSongsHelper,
  getPlaylistItems
}