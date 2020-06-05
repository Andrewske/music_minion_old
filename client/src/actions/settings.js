import axios from 'axios';
import { setAlert } from './alert';

import { IMPORT_PLAYLISTS, IMPORT_ERROR } from './types';

// Import the users Spotify playlists
export const importSpotifyPlaylists = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/spotify/import/playlist/all');

    dispatch({
      type: IMPORT_PLAYLISTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: IMPORT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
