import React, { Fragment } from 'react';

const SocialLoginButtons = () => {
  return (
    <Fragment>
      <a
        href='http://localhost:5000/api/auth/spotify'
        className='btn btn-spotify'
      >
        <i className='fa fa-spotify mr-1'></i> Log In with Spotify
      </a>
      <a
        href='http://localhost:5000/api/auth/google'
        className='btn btn-google'
      >
        <i className='fab fa-google mr-1'></i> Log in with Google
      </a>
    </Fragment>
  );
};

export default SocialLoginButtons;
