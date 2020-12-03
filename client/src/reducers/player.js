/* eslint-disable import/no-anonymous-default-export */
import {
  PLAYER_LOAD,
  PLAYER_STATE,
  PLAYER_ERROR,
  PLAYER_PAUSE,
  PLAYER_PLAY,
  PLAYER_DEVICE,
  PLAYER_CURRENT,
  UPDATE_TOKEN,
} from '../actions/types';

const initialState = {
  loading: true,
  track_id: null,
  waveform: null,
  deviceId: null,
  position: null,
  duration: null,
  trackName: null,
  albumName: null,
  artistName: null,
  playing: null,
  access_token: null,
  expires_at: null,
  current: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PLAYER_LOAD:
      return {
        ...state,
        track_id: payload.track_id,
        waveform: payload.waveform,
      };
    case PLAYER_CURRENT:
      return {
        ...state,
        current: payload,
        playing: payload.is_playing,
      };
    case PLAYER_STATE:
      const {
        current_track: currentTrack,
        position,
        duration,
      } = payload.track_window;
      const artists = currentTrack.artists
        .map((artist) => artist.name)
        .join(', ');
      return {
        ...state,
        position,
        duration,
        trackName: currentTrack.name,
        albumName: currentTrack.album.name,
        artistName: artists,
        playing: !payload.paused,
      };
    case PLAYER_PLAY:
      return {
        ...state,
        playing: true,
      };
    case PLAYER_PAUSE:
      return {
        ...state,
        playing: false,
      };
    case PLAYER_DEVICE:
      return {
        ...state,
        deviceId: payload,
        loading: false,
      };
    case PLAYER_ERROR:
      return {
        ...state,
        error: { ...state.error, payload },
        track_id: null,
        waveform: null,
        position: null,
        duration: null,
        trackName: null,
        albumName: null,
        artistName: null,
        playing: null,
        loading: true,
      };
    case UPDATE_TOKEN:
      return {
        ...state,
        access_token: payload.access_token,
        expires_at: payload.expires_at,
      };
    default:
      return state;
  }
}
