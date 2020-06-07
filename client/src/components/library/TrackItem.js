import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AudioFeatures from './AudioFeatures';
import Tags from './Tags';

const TrackItem = ({
  track: { track_id, name, artists, audio_features, tags },
}) => {
  const [showTrack, setShowTrack] = useState(false);

  const onClick = (e) => {
    setShowTrack(!showTrack);
  };

  return (
    <Fragment>
      <div className='track-item'>
        <span
          id='show-track'
          style={{ cursor: 'pointer' }}
          onClick={(e) => onClick(e)}
        >
          <p className='track-text' id={track_id}>
            {name} by{' '}
            {artists &&
              artists.map(({ artist_id, name }) => (
                <span key={artist_id}>{name}</span>
              ))}
          </p>
        </span>
        <Tags track_id={track_id} track_tags={tags} />
      </div>
      {showTrack && <AudioFeatures features={audio_features} />}
    </Fragment>
  );
};
//        <Img className='track-item-img' src={img_url} loading={Loader} />

TrackItem.propTypes = {
  track: PropTypes.object.isRequired,
};

export default connect(null, {})(TrackItem);
