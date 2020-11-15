import {
  IMPORT_PLAYLISTS,
  IMPORT_TRACKS,
  IMPORT_ERROR,
  IMPORT_START,
  IMPORT_END,
} from '../actions/types';

const initialState = {
  playlists: {},
  tracks: [],
  importing: false,
  import_playlists: false,
  import_tracks: false,
  error: {},
  limit: null,
  owner: null,
  useLastFm: false,
  failed_playlists: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case IMPORT_START:
      return {
        ...state,
        playlists: {},
        tracks: [],
        limit: payload.limit,
        owner: payload.owner,
        useLastFm: payload.useLastFm,
        import_playlists: true,
        importing: true,
        error: {},
      };
    case IMPORT_PLAYLISTS:
      return {
        ...state,
        playlists: payload,
        import_playlists: false,
        import_tracks: true,
      };
    case IMPORT_TRACKS:
      return {
        ...state,
        tracks: [...state.tracks, payload],
        import_tracks: false,
      };
    case IMPORT_END:
      return {
        ...state,
        import_playlists: false,
        import_tracks: false,
        importing: false,
      };
    case IMPORT_ERROR:
      return {
        ...state,
        error: { ...state.error, payload },
        import_playlists: false,
        import_tracks: false,
        importing: true,
      };
    default:
      return state;
  }
}
