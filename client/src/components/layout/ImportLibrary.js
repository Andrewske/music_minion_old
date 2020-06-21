import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { importPlaylists, importTracks } from '../../actions/importLibrary';

const ImportLibrary = ({
  importPlaylists,
  importTracks,
  importLibrary: {
    import_playlists,
    import_tracks,
    importing,
    playlists: { number_of_playlists, playlist_data },
    tracks,
    limit,
    owner,
    useLastFm,
  },
}) => {
  useEffect(() => {
    if (import_playlists) {
      importPlaylists({ limit, owner });
    }
    if (import_tracks) {
      importTracks(playlist_data, useLastFm);
    }
  });

  if (importing) {
    const done = tracks.length || 0;
    const total = number_of_playlists || 0;
    return (
      <div className={`alert alert-success`}>
        Processing {done} out of {total} playlists
      </div>
    );
  }
  return <div className='hidden' />;
};

ImportLibrary.propTypes = {
  importPlaylist: PropTypes.func,
  importTracks: PropTypes.func,
  importLibrary: PropTypes.object,
};

const mapStateToProps = (state) => ({
  importLibrary: state.importLibrary,
});

export default connect(mapStateToProps, { importPlaylists, importTracks })(
  ImportLibrary
);
