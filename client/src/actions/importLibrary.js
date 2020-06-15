import axios from 'axios';
//import { setAlert } from './alert';
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
    await Promise.all(
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
    console.error(`Error importing tracks: ${err.message}`);
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
