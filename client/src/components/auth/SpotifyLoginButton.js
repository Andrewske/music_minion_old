import React, { Fragment } from 'react';

const SpotifyLoginButton = () => {
  return (
    <Fragment>
      <a
        href='http://localhost:5000/api/auth/spotify'
        className='btn btn-spotify'
      >
        <i className='fa fa-spotify mr-1'></i> Log In with Spotify
      </a>
    </Fragment>
  );
};

export default SpotifyLoginButton;
