import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTracks } from '../../actions/track';
import { clearTracks } from '../../actions/library';
import Loader from '../layout/Loader';
import TrackItem from './TrackItem';
import AudioFeatures from './AudioFeatures';
import { ReactComponent as Back } from '../../img/back.svg';

const Tracks = ({
  getTracks,
  clearTracks,
  tracks,
  playlist_features,
  loading,
  playlist,
  artist,
  genre,
}) => {
  useEffect(() => {
    !playlist && !artist && !genre && getTracks();
  }, [getTracks]);
  const onClick = (e) => {
    clearTracks();
  };
  const name = playlist
    ? playlist.name
    : artist
    ? artist.name
    : genre
    ? genre.name
    : null;
  const img_url = playlist ? playlist.img_url : null;
  return loading && tracks.length > 0 ? (
    <Loader />
  ) : (
    <Fragment>
      <div className='tracks-title'>
        {name && (
          <Fragment>
            {img_url && (
              <img className='playlist-img' src={img_url} alt={name} />
            )}
            <h1>{name}</h1>
          </Fragment>
        )}
      </div>
      {playlist_features && <AudioFeatures features={playlist_features} />}
      <div className='item-list'>
        {tracks.map((track) => (
          <TrackItem key={track.track_id} track={track} />
        ))}
      </div>
    </Fragment>
  );
};

Tracks.propTypes = {
  tracks: PropTypes.array.isRequired,
  clearTracks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tracks: state.library.tracks,
  playlist: state.library.playlist,
  playlist_features: state.library.playlist_features,
  artist: state.library.artist,
  genre: state.library.genre,
});

export default connect(mapStateToProps, { clearTracks, getTracks })(Tracks);
