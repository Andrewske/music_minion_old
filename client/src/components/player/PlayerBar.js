import React from 'react';
import { connect } from 'react-redux';
import WaveForm from './WaveForm';
import PropTypes from 'prop-types';

const PlayerBar = ({ waveform }) => {
  return (
    <div className='playerbar'>
      <h1>Hello</h1>
      <WaveForm />
    </div>
  );
};

PlayerBar.propTypes = {};

const mapStateToProps = (state) => ({
  waveform: state.player.waveform,
});

export default connect(mapStateToProps)(PlayerBar);
