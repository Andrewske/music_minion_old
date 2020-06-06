import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { clearTracks } from '../../actions/library';
import Loader from '../layout/Loader';
import TrackItem from './TrackItem';

const Tracks = ({ clearTracks, tracks, loading, playlist: { name } }) => {
  const onClick = (e) => {
    clearTracks();
  };
  return loading && tracks.length > 0 ? (
    <Loader />
  ) : (
    <Fragment>
      <span style={{ cursor: 'pointer' }} onClick={(e) => onClick(e)}>
        <h1>
          <i className='fas fa-arrow-left'></i> {name}
        </h1>
      </span>
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
  playlist: PropTypes.object.isRequired,
  clearTracks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tracks: state.library.tracks,
  playlist: state.library.playlist,
});

export default connect(mapStateToProps, { clearTracks })(Tracks);
