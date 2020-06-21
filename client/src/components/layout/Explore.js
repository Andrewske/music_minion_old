import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Playlists from '../library/Playlists';
import Artists from '../library/Artists';
import Tracks from '../library/Tracks';
import Genres from '../library/Genres';
import { clearTracks } from '../../actions/library';

const Explore = ({ tracks, clearTracks }) => {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [showTracks, setShowTracks] = useState(false);
  const [showArtists, setShowArtists] = useState(false);
  const [showGenres, setShowGenres] = useState(false);

  const onClick = (filter) => {
    clearTracks();
    setShowPlaylists(false);
    setShowTracks(false);
    setShowArtists(false);
    setShowGenres(false);
    switch (filter) {
      case 'playlists':
        return setShowPlaylists(!showPlaylists);
      case 'tracks':
        return setShowTracks(!showTracks);
      case 'artists':
        return setShowArtists(!showArtists);
      case 'genres':
        return setShowGenres(!showGenres);
      default:
        return;
    }
  };

  return (
    <Fragment>
      <span className='filter-buttons'>
        <button
          className='filter-btn playlist'
          onClick={() => onClick('playlists')}
        >
          Playlists
        </button>
        <button
          className='filter-btn artist'
          onClick={() => onClick('artists')}
        >
          Artists
        </button>
        <button className='filter-btn track' onClick={() => onClick('tracks')}>
          Tracks
        </button>
        <button className='filter-btn genre' onClick={() => onClick('genres')}>
          Genres
        </button>
      </span>

      {showPlaylists && tracks.length !== 0 ? (
        <Tracks />
      ) : (
        showPlaylists && <Playlists />
      )}
      {showArtists && tracks.length !== 0 ? (
        <Tracks />
      ) : (
        showArtists && <Artists />
      )}
      {showTracks && <Tracks />}
      {showGenres && tracks.length !== 0 ? (
        <Tracks />
      ) : (
        showGenres && <Genres />
      )}

      {/* {playlist && tracks.length !== 0 ? <Tracks /> : <Playlists />} */}
    </Fragment>
  );
};

Explore.propTypes = {
  tracks: PropTypes.array,
  playlist: PropTypes.object,
  clearTracks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  //playlists: state.playlists,
  playlist: state.library.playlist,
  tracks: state.library.tracks,
});

export default connect(mapStateToProps, { clearTracks })(Explore);
