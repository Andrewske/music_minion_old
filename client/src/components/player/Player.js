import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import WaveForm from './WaveForm';
import { loadTrack, playTrack, pauseTrack } from '../../actions/player';
import { ReactComponent as PlayIcon } from '../../img/play-button.svg';
import { ReactComponent as PauseIcon } from '../../img/pause-button.svg';

const Player = ({
  track_id,
  waveform,
  playTrack,
  pauseTrack,
  loadTrack,
  playing,
  access_token,
  deviceId,
}) => {
  const const_id = '7vRP1mpX01oPqoaMqNO1ma';

  useEffect(() => {
    console.log('here');
    loadTrack(const_id);
  }, [loadTrack]);

  const handleClick = () => {
    if (access_token && deviceId && track_id) {
      playing
        ? pauseTrack(access_token)
        : playTrack(access_token, track_id, deviceId);
    } else {
      loadTrack(const_id);
    }
  };

  return (
    <div className='explore-container'>
      <button className='menu-item'>
        {!playing ? (
          <PlayIcon
            className='svg icon-button'
            style={{ fill: 'white', padding: '2px' }}
            onClick={() => handleClick()}
          />
        ) : (
          <PauseIcon
            className='svg icon-button'
            style={{ fill: 'white', padding: '2px' }}
            onClick={() => handleClick()}
          />
        )}
      </button>
      {waveform && <WaveForm />}
    </div>
  );
};

Player.propTypes = {};

const mapStateToProps = (state) => ({
  track_id: state.player.track_id,
  waveform: state.player.waveform,
  playing: state.player.playing,
  access_token: state.player.access_token,
  deviceId: state.player.current.device.id,
});

export default connect(mapStateToProps, { playTrack, pauseTrack, loadTrack })(
  Player
);
