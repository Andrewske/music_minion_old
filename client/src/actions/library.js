import axios from 'axios';
//import { setAlert } from './alert';

import {
  LOAD_PLAYLISTS,
  LOAD_TRACKS,
  CLEAR_TRACKS,
  LIBRARY_ERROR,
} from './types';

// Get current users playlists

export const getPlaylists = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/playlist/me');
    dispatch({
      type: LOAD_PLAYLISTS,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.message);
    dispatch({
      type: LIBRARY_ERROR,
      payload: { msg: err.message },
    });
  }
};

export const getTracks = (playlist) => async (dispatch) => {
  console.log('this is happening');
  try {
    const res = await axios.get(`/api/playlist/${playlist.playlist_id}`);
    console.log(res.data);
    dispatch({
      type: LOAD_TRACKS,
      payload: { playlist, data: res.data },
    });
  } catch (err) {
    console.error(err.message);
    dispatch({
      type: LIBRARY_ERROR,
      payload: { msg: err.message },
    });
  }
};

export const clearTracks = () => (dispatch) => {
  try {
    dispatch({
      type: CLEAR_TRACKS,
      payload: {},
    });
  } catch (err) {
    console.error(err);
  }
};
