import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import Moment from 'react-moment';
//import { Img } from 'react-image';
import { getTracks } from '../../actions/library';

const ListItem = ({ getTracks, type, current }) => {
  const onClick = () => {
    getTracks(type, current);
  };
  return (
    <div className='track-item'>
      <span style={{ cursor: 'pointer' }} onClick={() => onClick()}>
        <p className='track-text'>{current.name}</p>
      </span>
    </div>
  );
};
//        <Img className='playlist-item-img' src={img_url} loading={Loader} />

ListItem.propTypes = {
  getTracks: PropTypes.func.isRequired,
};

export default connect(null, { getTracks })(ListItem);
