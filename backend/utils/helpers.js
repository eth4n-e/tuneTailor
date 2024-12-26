const chunkArray = (array, chunkSize) => {
    // ensure that the incoming array is 1D
    const flatArr = array.flat();
    const result = [];
    for(let i = 0; i < flatArr.length; i += chunkSize) {
      result.push(flatArr.slice(i, i + chunkSize));
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
      let filteredBatch = await filterTrackIds(token, trackBatch);
      // TO-DO: think about adding a request to https://api.spotify.com/v1/me/tracks/contains so I'm only adding new tracks to liked songs
      let trackEndpoint = `https://api.spotify.com/v1/me/tracks?ids=${filteredBatch}`;
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

const filterTrackIds = async (token, trackIds) => {
  try {
    const endpoint = `https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds}`;
    const isLiked = await fetch(endpoint, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
      }
    }).then(response => response.json());

    const adjustedTrackIds = trackIds.filter((id, index) => {
      if(!isLiked[index]) {
        return id;
      }
    });
   
    return adjustedTrackIds;
  } catch (err) {
    console.error(err);
  }
}

const deleteLikedSongsHelper = async (token, trackIds) => {
  try { 
    console.log("Initiated call to deleteLikedSongsHelper");
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

const paginateLikedSongs = async (token) => {
  try {
    const LIMIT = 50;
    let tracks = [];
    let trackEndpoint = `https://api.spotify.com/v1/me/tracks?limit=${LIMIT}`;
    // responses from Get User's Saved Tracks contains a next key which points to next endpoint
    // next endpoint for last page of tracks is null
    while(trackEndpoint !== null) {
        let trackData = await fetch(trackEndpoint, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', 
            }
        }).then(response => response.json());

        if(trackData.items !== undefined) {
            let trackItems = trackData.items.map(item => item.track);
            tracks = tracks.concat(trackItems);
            trackEndpoint = trackData.next;
        }
    }

    return tracks;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  addTracksToLikedSongsHelper,
  deleteLikedSongsHelper,
  paginateLikedSongs,
  getPlaylistItems
}