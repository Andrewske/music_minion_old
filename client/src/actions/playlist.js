import axios from 'axios';
import { setAlert } from './alert';

import { LOAD_PLAYLISTS, PLAYLIST_ERROR } from './types';

// Get current users playlists

export const getPlaylists = () => async (dispatch) => {
  console.log('Is this even called?');
  try {
    console.log('Getting Playlists');
    const res = await axios.get('/api/playlist/me');
    dispatch({
      type: LOAD_PLAYLISTS,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.message);
    dispatch({
      type: PLAYLIST_ERROR,
      payload: { msg: err.message },
    });
  }
};
