import { redirect } from "react-router-dom";
import axios from "axios";

export const createHandleCardClick = (stateUpdateFunction) => {
    // return function which updates list of items (tracks, playlists)
    // takes as parameter the appropriate state updating function
    return (id) => {
        // have to update list in a state setter for React to handle properly
        stateUpdateFunction(prevList => {
            let updatedArr = [];

            if (prevList.indexOf(id) === -1) { // track not present in list
                updatedArr = [...prevList, id];
            } else {
                // create new array without element that was clicked
                updatedArr = prevList.filter(itemId => itemId !== id);
            }
            // updated list becomes the new state upon return
            return updatedArr;
        });
    }
}

export const createHandleAddFromTopTracks = () => {
  return async function handleAddFromTopTracks(user, itemIds, setClicked) {
    setClicked(itemIds.filter(id => !itemIds.includes(id)));

    await axios('/api/music/addTracksToLikedSongs', {
      method: 'put',
      data: {user, itemIds}, // in put requests pass payload in data property
    });
  }
}

export const createHandleAddFromPlaylists = () => {
   return async function handleAddFromPlaylist(user, itemIds, setClicked) {
    setClicked(itemIds.filter(id => !itemIds.includes(id)));

    await axios('/api/music/addTracksFromPlaylistsToLikedSongs', {
      method: 'put',
      data: {user, itemIds}
    })
   }
}

export const createHandleDeleteFromLiked = () => {
  return async function handleDeleteFromLiked(user, itemIds, setClicked, setTracks) {
    await axios('/api/music/deleteLikedSongs', {
      method: 'delete',
      data: {user, itemIds}, // in delete requests pass payload in data property
    });

    setClicked(itemIds.filter(id => !itemIds.includes(id))); // also maybe package this into a helper method -> resetClickedTracksState

    // remove deleted tracks from the state maintaining the list of liked songs
    setTracks(prevList => {
      let updatedTrackList = [];
      updatedTrackList = prevList.filter(track => !itemIds.includes(track.id));
      return updatedTrackList;
    });
  }
}

export const createHandleDeleteAllLiked = () => {
  return async function handleDeleteAllLiked(token, setTracks) {
    await axios('/api/music/deleteAllLikedSongs', {
      method: 'delete',
      data: {token}
    });

    // no tracks to display after complete deletion
    setTracks([]);
  }
}


// method which updates user token and session data if necessary
// runs on every page load of liked songs, top tracks, playlists
export const userLoader = async function() {
    try {
      const userSession = await axios.get('/api/music/getUser');
  
      console.log("user from getUser endpoint: ", userSession);
      let user = userSession.data.user;
      
      if(Date.now() >= user.tokenExpiration) {
        // update the user's tokens
        // placing expiration check here prevents updateUser from being called every render
        user = await axios.put('/api/music/updateUser', {
          user: user
        })
      }
      
      return user;
    } catch (err) {
      console.error(err);
      // can redirect to login because user should exist by this point
      return redirect('/login');
    }
  }