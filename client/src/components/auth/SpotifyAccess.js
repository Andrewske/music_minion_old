import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { UPDATE_TOKEN } from '../../actions/types';
import axios from 'axios';

const SpotifyAccess = ({
  isAuthenticated,
  access_token,
  expires_at,
  UpdateToken,
}) => {
  const [time, setTime] = useState(Date.now());

  //Get the current time every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 50000);
    return () => clearInterval(interval);
  });

  //Get the current access token
  const getToken = useCallback(async () => {
    // Get the users spotify token
    let res = await axios.get('/api/spotify/token');
    let { access_token, expires_at } = res.data;
    UpdateToken({ access_token, expires_at });
  }, [UpdateToken]);

  useEffect(() => {
    if (isAuthenticated && !access_token) {
      console.log('Getting Spotify Access token');
      getToken();
    }
  }, [getToken, access_token, isAuthenticated]);

  //Check if access token is within 5 minutes of expire and refresh

  const refreshToken = useCallback(async () => {
    console.log('Refreshing token');
    let res = await axios.get('/api/spotify/token/refresh');
    let { access_token, expires_at } = res.data;
    UpdateToken({ access_token, expires_at });
  }, [UpdateToken]);

  useEffect(() => {
    if (isAuthenticated && expires_at && expires_at < time - 50000) {
      console.log('Access Token Expired');
      refreshToken();
    }
  }, [time, expires_at, refreshToken, isAuthenticated]);

  return <Fragment></Fragment>;
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  access_token: state.player.access_token,
  expires_at: state.player.expires_at,
});

const mapDispatchToProps = (dispatch) => ({
  UpdateToken: (payload) => {
    dispatch({ type: UPDATE_TOKEN, payload });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyAccess);
