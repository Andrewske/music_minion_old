import axios from 'axios';
//import { setAlert } from './alert';

import { LOAD_ARTISTS, LIBRARY_ERROR } from './types';

// Get current users playlists

export const getArtists = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/artist/me?limit=10&page=1');
    console.log(res.data);
    dispatch({
      type: LOAD_ARTISTS,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: LIBRARY_ERROR,
      payload: { msg: err.message },
    });
  }
};
