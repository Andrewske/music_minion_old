import axios from 'axios';
//import { setAlert } from './alert';

import { LOAD_GENRES, LIBRARY_ERROR } from './types';

// Get current users playlists

export const getGenres = () => async (dispatch) => {
  console.log('Getting Genres');
  try {
    const res = await axios.get('/api/genre/me');
    dispatch({
      type: LOAD_GENRES,
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
