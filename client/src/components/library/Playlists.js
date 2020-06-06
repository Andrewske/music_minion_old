import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPlaylists } from '../../actions/playlist';
import store from '../../store';
import { loadUser } from '../../actions/auth';

const Playlists = ({ getPlaylists, playlist: { playlists, loading } }) => {
  useEffect(() => {
    console.log('Please get playlists');
    async function load() {
      await store.dispatch(loadUser());
      await getPlaylists();
    }
    load();
  }, [getPlaylists]);

  const loadFirst = async () => {
    let user = await loadUser();
  };
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
