import {
  LOAD_PLAYLISTS,
  LIBRARY_ERROR,
  LOAD_ARTISTS,
  CLEAR_TRACKS,
  LOAD_TRACKS,
  LOAD_GENRES,
} from '../actions/types';

const initialState = {
  user: null,
  playlist: null,
  genre: null,
  artist: null,
  playlist_features: {},
  playlists: [],
  tracks: [],
  artists: [],
  genres: [],
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
        artist: payload.artist,
        playlist: payload.playlist,
        tracks: payload.tracks,
        genre: payload.tag,
        playlist_features: payload.playlist_features,
        loading: false,
      };
    case CLEAR_TRACKS:
      return {
        ...state,
        playlist: null,
        artist: null,
        genre: null,
        tracks: [],
        loading: false,
      };
    case LOAD_ARTISTS:
      return {
        ...state,
        artists: payload,
        loading: false,
      };
    case LOAD_GENRES:
      return {
        ...state,
        genres: payload,
        loading: false,
      };
    case LIBRARY_ERROR:
      return {
        ...state,
        error: { ...state.error, payload },
        loading: false,
        tracks: [],
      };
    default:
      return state;
  }
}
