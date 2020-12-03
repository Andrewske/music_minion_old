import React, { Fragment, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { PLAYER_STATE, PLAYER_ERROR, PLAYER_DEVICE } from '../../actions/types';
import { loadCurrentPlayer } from '../../actions/player';

const SpotifyPlayer = ({
  PlayerStateChange,
  PlayerError,
  UpdateDevice,
  access_token,
  LoadCurrent,
  myDeviceId,
  currentDeviceId,
  playing,
}) => {
  const onStateChange = useCallback(
    (state) => {
      if (state !== null) {
        PlayerStateChange(state);
      } else {
        PlayerError();
      }
    },
    [PlayerStateChange, PlayerError]
  );

  const createEventHandlers = useCallback(
    (player) => {
      player.on('initialization_error', (e) => {
        console.error(e);
        PlayerError(e);
      });
      player.on('authentication_error', (e) => {
        console.error(e);
        PlayerError(e);
      });
      player.on('account_error', (e) => {
        console.error(e);
        PlayerError(e);
      });
      player.on('playback_error', (e) => {
        console.error(e);
        PlayerError(e);
      });

      // Playback status updates
      player.on('player_state_changed', (state) => {
        onStateChange(state);
      });

      // Ready
      player.on('ready', (data) => {
        console.log('Let the music play on!');
        UpdateDevice(data.device_id);
      });
    },
    [onStateChange, UpdateDevice, PlayerError]
  );

  useEffect(() => {
    if (window.Spotify && access_token) {
      let player = new window.Spotify.Player({
        name: 'Music Minion',
        getOAuthToken: (cb) => {
          cb(access_token);
        },
      });
      createEventHandlers(player);
      player.connect();
    }
  }, [access_token, createEventHandlers]);

  //Get current player info
  useEffect(() => {
    LoadCurrent(access_token);
  }, [access_token, LoadCurrent]);

  //If playing check current player info regularly
  useEffect(() => {
    if (playing && myDeviceId !== currentDeviceId) {
      const interval = setInterval(() => {
        LoadCurrent(access_token);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [playing, access_token, LoadCurrent, myDeviceId, currentDeviceId]);

  return <Fragment></Fragment>;
};

const mapStateToProps = (state) => ({
  access_token: state.player.access_token,
  loading: state.player.loading,
  playing: state.player.playing,
  myDeviceId: state.player.deviceId,
  currentDeviceId: state.player.current.device.id,
});

const mapDispatchToProps = (dispatch) => ({
  PlayerStateChange: (payload) => {
    dispatch({ type: PLAYER_STATE, payload });
  },
  PlayerError: (payload = null) => {
    dispatch({ type: PLAYER_ERROR, payload });
  },
  UpdateDevice: (payload) => {
    dispatch({ type: PLAYER_DEVICE, payload });
  },
  LoadCurrent: (access_token) => {
    dispatch(loadCurrentPlayer(access_token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyPlayer);
