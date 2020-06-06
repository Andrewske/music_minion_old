import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import Moment from 'react-moment';
//import { Img } from 'react-image';
import { getTracks } from '../../actions/library';

//import Loader from '../layout/Loader';

const PlaylistItem = ({
  getTracks,
  playlist,
  playlist: { playlist_id, name },
}) => {
  const onClick = () => {
    getTracks(playlist);
  };
  return (
    <span style={{ cursor: 'pointer' }} onClick={() => onClick()}>
      <p className='playlist-name' id={playlist_id}>
        {name}
      </p>
    </span>
  );
};
//        <Img className='playlist-item-img' src={img_url} loading={Loader} />

PlaylistItem.propTypes = {
  playlist: PropTypes.object.isRequired,
  getTracks: PropTypes.func.isRequired,
};

export default connect(null, { getTracks })(PlaylistItem);
