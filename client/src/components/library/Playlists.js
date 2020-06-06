import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getPlaylists } from '../../actions/playlist';
import { loadUser } from '../../actions/auth';
import PlaylistItem from './PlaylistItem';
import Loader from '../layout/Loader';
import store from '../../store';

const Playlists = ({ getPlaylists, playlist: { playlists, loading } }) => {
  useEffect(() => {
    console.log('Please get playlists');
    async function load() {
      await store.dispatch(loadUser());
      await getPlaylists();
    }
    load();
  }, [getPlaylists]);

  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <div className='item-list'>
        {playlists.map((playlist) => (
          <PlaylistItem key={playlist.playlist_id} playlist={playlist} />
        ))}
      </div>
    </Fragment>
  );
};

Playlists.propTypes = {
  getPlaylists: PropTypes.func.isRequired,
  playlists: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  playlist: state.playlist,
});

export default connect(mapStateToProps, { getPlaylists })(Playlists);
