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

export const startImport = (formData) => (dispatch) => {
  dispatch({
    type: IMPORT_START,
    payload: formData,
  });
};

export const importPlaylists = ({ limit, owner }) => async (dispatch) => {
  console.log('importing playlists');
  try {
    const res = await axios.get(
      `/api/spotify/import/playlist/all?limit=${limit}&owner=${owner}`
    );

    dispatch({
      type: IMPORT_PLAYLISTS,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.message);
    dispatch({
      type: IMPORT_ERROR,
      payload: { msg: err.message },
    });
  }
};

export const importTracks = (playlist_data) => async (dispatch) => {
  try {
    const asyncRes = await Promise.all(
      playlist_data.map(async ({ playlist_id }) => {
        try {
          const res = await axios.get(
            `/api/spotify/import/playlist/track/${playlist_id}`
          );
          dispatch({
            type: IMPORT_TRACKS,
            payload: res.data,
          });
        } catch (e) {
          dispatch({
            type: IMPORT_ERROR,
            payload: { msg: e },
          });
        }
      })
    );
  } catch (err) {
    console.error(err.message);
    dispatch({
      type: IMPORT_ERROR,
      payload: { msg: err },
    });
  } finally {
    dispatch({
      type: IMPORT_END,
      payload: null,
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
