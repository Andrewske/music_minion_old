import { LOAD_PLAYLISTS, LIBRARY_ERROR } from '../actions/types';

const initialState = {
  user: null,
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
        laoding: false,
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
