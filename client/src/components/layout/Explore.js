import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Playlists from '../library/Playlists';

const Explore = (props) => {
  const [filters, setFilters] = useState({
    playlists: true,
    artists: false,
    genres: false,
    tracks: false,
  });

  const { playlists, artists, genres, tracks } = filters;

  return (
    <Fragment>
      <div>Welcome to Exploring!</div>
      <Playlists />
    </Fragment>
  );
};

Explore.propTypes = {};

const mapStateToProps = (state) => ({
  playlists: state.playlists,
});

export default connect(mapStateToProps)(Explore);
