import axios from 'axios';
import { setAlert } from './alert';
import {
  IMPORT_START,
  IMPORT_END,
  IMPORT_ERROR,
  IMPORT_TRACKS,
  IMPORT_PLAYLISTS,
} from './types';

// Import Playlists

export const startImport = (formData) => async (dispatch) => {
  dispatch({
    type: IMPORT_START,
    payload: formData,
  });
};

export const importPlaylists = (limit) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/api/spotify/import/playlist/all?limit=${limit}`
    );

    dispatch({
      type: IMPORT_PLAYLISTS,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.message);
    dispatch({
      type: IMPORT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const importTracks = (playlist_ids) => async (dispatch) => {
  try {
    const asyncRes = await Promise.all(
      playlist_ids.map(async (id) => {
        const res = await axios.get(`/api/spotify/import/playlist/track/${id}`);
        dispatch({
          type: IMPORT_TRACKS,
          payload: res.data,
        });
      })
    );
    dispatch({
      type: IMPORT_END,
      payload: null,
    });
  } catch (err) {
    console.error(err.message);
    dispatch({
      type: IMPORT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const endImport = () => async (dispatch) => {
  console.log('ending the import');
  try {
    dispatch({
      type: IMPORT_END,
      payload: null,
    });
  } catch (err) {
    console.error(err.message);
    dispatch({
      type: IMPORT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
