import { LOAD_PLAYLISTS, PLAYLIST_ERROR } from '../actions/types';

const initialState = {
  playlists: [],
  playlist_features: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_PLAYLISTS:
      return {
        ...state,
        playlists: payload.playlists,
        playlist_features: payload.playlist_features,
        loading: false,
      };
    case PLAYLIST_ERROR:
      return {
        ...state,
        error: { ...state.error, payload },
        loading: false,
      };
    default:
      return state;
  }
}
