import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AudioFeatures from './AudioFeatures';
import Tags from '../tag/Tags';
import convertDuration from '../../reducers/convertDuration';
import convertKey from '../../utils/convertKey';
const _ = require('lodash');

const TrackItem = ({
  track: { track_id, name, artists, audio_features, tags },
}) => {
  const [showTrack, setShowTrack] = useState(false);
  const af = (audio_features && audio_features[0]) || null;
  const onClick = (e) => {
    setShowTrack(!showTrack);
  };

  const key = af && convertKey(af.track_key, af.mode);

  return (
    <Fragment>
      <div className='track-item'>
        <span
          id='show-track'
          style={{ cursor: 'pointer' }}
          onClick={(e) => onClick(e)}
        >
          <p className='track-primary' id={track_id}>
            {name}
          </p>
          <p className='track-secondary'>
            {artists &&
              artists.map(({ artist_id, name }, index) => (
                <span key={artist_id}>
                  {name} {index < artists.length - 1 ? ' \u2022 ' : ''}
                </span>
              ))}
          </p>
          <p className='track-secondary'>
            {audio_features && (
              <Fragment>
                <span className='bpm'>{Math.round(af.tempo)}</span>
                <span> {'\u2022'} </span>
                <span style={{ color: key.color }}>{key.camelot}</span>
                <span> {'\u2022'} </span>
                <span className='duration'>
                  {convertDuration(af.duration_ms)}
                </span>
              </Fragment>
            )}
          </p>
        </span>
        <Tags track_id={track_id} track_tags={tags} />
      </div>
      {showTrack && audio_features && <AudioFeatures features={af} />}
    </Fragment>
  );
};
//        <Img className='track-item-img' src={img_url} loading={Loader} />

TrackItem.propTypes = {
  track: PropTypes.object.isRequired,
};

export default connect(null, {})(TrackItem);
