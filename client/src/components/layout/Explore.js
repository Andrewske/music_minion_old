import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Playlists from '../library/Playlists';
import Tracks from '../library/Tracks';

const Explore = ({ playlists, tracks, playlist }) => {
  // const [filters, setFilters] = useState({
  //   playlists: true,
  //   artists: false,
  //   genres: false,
  //   tracks: false,
  // });

  // const { playlists, artists, genres, tracks } = filters;

  return playlist && tracks.length !== 0 ? <Tracks /> : <Playlists />;
};

Explore.propTypes = {
  tracks: PropTypes.array,
  playlist: PropTypes.object,
};

const mapStateToProps = (state) => ({
  playlists: state.playlists,
  playlist: state.library.playlist,
  tracks: state.library.tracks,
});

export default connect(mapStateToProps)(Explore);
