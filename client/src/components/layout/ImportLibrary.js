import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  importPlaylists,
  importTracks,
  endImport,
} from '../../actions/importLibrary';

const ImportLibrary = ({
  importPlaylists,
  importTracks,
  importLibrary: {
    importing,
    playlists: { number_of_playlists, playlist_ids },
    tracks,
    limit,
  },
}) => {
  useEffect(() => {
    if (importing && !number_of_playlists) {
      console.log('Importing is true?');
      importPlaylists(limit);
    }
    // if (importing && number_of_playlists > 0) {
    //   importTracks(playlist_ids);
    // }
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
