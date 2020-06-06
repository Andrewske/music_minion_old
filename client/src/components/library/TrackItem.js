import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//import Moment from 'react-moment';
//import { Img } from 'react-image';
//import Loader from '../layout/Loader';

const TrackItem = ({ track: { track_id, name, artists } }) => {
  const onClick = (e) => {
    console.log(e.target.id);
  };

  return (
    <div className='track-item'>
      <span style={{ cursor: 'pointer' }} onClick={(e) => onClick(e)}>
        <p className='track-text' id={track_id}>
          {name} by{' '}
          {artists &&
            artists.map(({ artist_id, name }) => (
              <span key={artist_id}>{name}</span>
            ))}
        </p>
      </span>
    </div>
  );
};
//        <Img className='track-item-img' src={img_url} loading={Loader} />

TrackItem.propTypes = {
  track: PropTypes.object.isRequired,
};

export default connect(null, {})(TrackItem);
