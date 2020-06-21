import axios from 'axios';

import { LOAD_TRACKS, LIBRARY_ERROR } from './types';

// Get current users tracks

export const getTracks = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/track/me?limit=10&page=1');
    dispatch({
      type: LOAD_TRACKS,
      payload: { tracks: res.data },
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: LIBRARY_ERROR,
      payload: { msg: err.message },
    });
  }
};
