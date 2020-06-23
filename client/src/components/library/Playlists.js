import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getPlaylists } from '../../actions/playlist';
import ListItem from './ListItem';
import Loader from '../layout/Loader';

const Playlists = ({
  ownedPlaylists,
  getPlaylists,
  playlist: { playlists, loading },
}) => {
  useEffect(() => {
    async function load() {
      await getPlaylists();
    }
    load();
  }, [getPlaylists]);
  playlists = ownedPlaylists
    ? playlists.filter((playlist) => playlist.owner === true)
    : playlists;
  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <div className='item-list'>
        {playlists.map((playlist) => (
          // <PlaylistItem key={playlist.playlist_id} playlist={playlist} />
          <ListItem
            key={playlist.playlist_id}
            type='playlist'
            current={playlist}
          />
        ))}
      </div>
    </Fragment>
  );
};

Playlists.propTypes = {
  getPlaylists: PropTypes.func.isRequired,
  playlist: PropTypes.object,
};

const mapStateToProps = (state) => ({
  playlist: state.playlist,
  ownedPlaylists: state.filter.ownedPlaylists,
});

export default connect(mapStateToProps, { getPlaylists })(Playlists);
