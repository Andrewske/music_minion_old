import {
  IMPORT_PLAYLISTS,
  IMPORT_TRACKS,
  IMPORT_ERROR,
  IMPORT_START,
  IMPORT_END,
} from '../actions/types';

const initialState = {
  playlists: {},
  tracks: {},
  importing: false,
  error: {},
  limit: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case IMPORT_START:
      console.log('starting the import?');
      return {
        ...state,
        playlists: {},
        limit: payload.limit,
        importing: true,
        error: {},
      };
    case IMPORT_PLAYLISTS:
      return {
        ...state,
        playlists: payload,
        importing: false,
      };
    case IMPORT_TRACKS:
      return {
        ...state,
        tracks: payload,
        importing: false,
      };
    case IMPORT_END:
      return {
        ...state,
        importing: false,
      };
    case IMPORT_ERROR:
      return {
        ...state,
        error: payload,
        importing: false,
      };
    default:
      return state;
  }
}
