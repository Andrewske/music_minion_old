import {
  SHOW_PLAYLISTS,
  SHOW_ARTISTS,
  SHOW_TRACKS,
  SHOW_GENRES,
  SHOW_SORT,
  SHOW_FILTER,
  OWNED_PLAYLISTS,
  CLOSE_FILTER,
  CLOSE_SORT,
} from '../actions/types';

const initialState = {
  showPlaylists: false,
  showArtists: false,
  showTracks: false,
  showGenres: false,
  showSort: false,
  showFilter: false,
  ownedPlaylists: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SHOW_PLAYLISTS:
      return {
        ...state,
        showPlaylists: true,
        showArtists: false,
        showTracks: false,
        showGenres: false,
      };
    case SHOW_ARTISTS:
      return {
        ...state,
        showPlaylists: false,
        showArtists: true,
        showTracks: false,
        showGenres: false,
      };
    case SHOW_TRACKS:
      return {
        ...state,
        showPlaylists: false,
        showArtists: false,
        showTracks: true,
        showGenres: false,
      };
    case SHOW_GENRES:
      return {
        ...state,
        showPlaylists: false,
        showArtists: false,
        showTracks: false,
        showGenres: true,
      };
    case SHOW_SORT:
      return {
        ...state,
        showSort: !state.showSort,
      };
    case CLOSE_SORT:
      return {
        ...state,
        showSort: false,
      };
    case SHOW_FILTER:
      return {
        ...state,
        showFilter: !state.showFilter,
      };
    case CLOSE_FILTER:
      return {
        ...state,
        showFilter: false,
      };
    case OWNED_PLAYLISTS:
      return {
        ...state,
        ownedPlaylists: !state.ownedPlaylists,
      };
    default:
      return state;
  }
}
