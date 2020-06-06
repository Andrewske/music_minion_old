import {
  LOAD_PLAYLISTS,
  LOAD_TRACKS,
  CLEAR_TRACKS,
  LIBRARY_ERROR,
} from '../actions/types';

const initialState = {
  user: null,
  playlist: null,
  playlists: [],
  tracks: [],
  artists: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_PLAYLISTS:
      return {
        ...state,
        playlists: payload,
        loading: false,
      };
    case LOAD_TRACKS:
      return {
        ...state,
        playlist: payload.playlist,
        tracks: payload.data,
        loading: false,
      };
    case CLEAR_TRACKS:
      return {
        ...state,
        playlist: null,
        tracks: [],
        loading: false,
      };
    case LIBRARY_ERROR:
      return {
        ...state,
        error: { ...state.error, payload },
        loading: false,
      };
    default:
      return state;
  }
}
