import axios from 'axios';

import {
  PLAYER_PLAY,
  PLAYER_LOAD,
  PLAYER_ERROR,
  PLAYER_PAUSE,
  PLAYER_CURRENT,
} from './types';

export const loadCurrentPlayer = (access_token) => async (dispatch) => {
  console.log('loadCurrentPlayer');
  try {
    const res = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/player`,
      params: {
        access_token: access_token,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    dispatch({ type: PLAYER_CURRENT, payload: res.data });
  } catch (err) {
    console.error(`loadCurrentPlayer: ${err}`);
  }
};

export const loadTrack = (track_id) => async (dispatch) => {
  console.log(`loadTrack`);
  try {
    const res = await axios.get(`/api/spotify/audio_analysis/${track_id}`);

    dispatch({
      type: PLAYER_LOAD,
      payload: { track_id, waveform: res.data },
    });
  } catch (err) {
    console.error(`loadTrack action error: ${err}`);
    dispatch({
      type: PLAYER_ERROR,
      payload: { msg: err.message },
    });
  }
};

export const playTrack = (access_token, track_id = null, deviceId) => async (
  dispatch
) => {
  console.log('playTrack');
  try {
    let body = {};
    if (track_id) {
      body = JSON.stringify({ uris: [`spotify:track:${track_id}`] });
    }
    await axios({
      method: 'put',
      url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, //
      body: body,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    dispatch({
      type: PLAYER_PLAY,
    });
  } catch (err) {
    console.error(`playTrack action error: ${err}`);
    dispatch({
      type: PLAYER_ERROR,
      payload: { msg: err.message },
    });
  }
};

export const pauseTrack = (access_token) => async (dispatch) => {
  console.log('pauseTrack');
  try {
    await axios({
      method: 'put',
      url: `https://api.spotify.com/v1/me/player/pause`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    dispatch({
      type: PLAYER_PAUSE,
    });
  } catch (err) {
    console.error(`pauseTrack action error: ${err}`);
    dispatch({
      type: PLAYER_ERROR,
      payload: { msg: err.message },
    });
  }
};
