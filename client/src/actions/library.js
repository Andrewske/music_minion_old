import axios from 'axios';

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

export const getTracks = (type, current) => async (dispatch) => {
  try {
    let artist,
      playlist,
      tag,
      url = null;
    switch (type) {
      case 'artist':
        url = `/api/artist/${current.artist_id}`;
        artist = current;
        break;
      case 'playlist':
        url = `/api/playlist/${current.playlist_id}`;
        playlist = current;
        break;
      case 'genre':
        url = `/api/genre/${current.tag_id}`;
        tag = current;
        break;
      default:
        url = '';
    }
    console.log(url);
    let res = await axios.get(url);
    const { tracks, audio_features } = res.data;
    console.log(`audio_features: ${audio_features}`);
    dispatch({
      type: LOAD_TRACKS,
      payload: { artist, playlist, tag, tracks, audio_features },
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
      payload: null,
    });
  } catch (err) {
    console.log('Error Clearing Tracks');
    console.error(err);
  }
};
