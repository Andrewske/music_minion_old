import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPlaylists } from '../../actions/playlist';

const Playlists = ({ getPlaylists, playlist: { playlists, loading } }) => {
  useEffect(() => {
    console.log('Please get playlists');
    getPlaylists();
  }, [getPlaylists]);

  return <h1>Hello!</h1>;
};

Playlists.propTypes = {
  getPlaylists: PropTypes.func.isRequired,
  playlists: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  playlist: state.playlist,
});

export default connect(mapStateToProps, { getPlaylists })(Playlists);
