import React, { Fragment } from 'react';

const GoogleLoginButton = () => {
  return (
    <Fragment>
      <a
        href='http://localhost:5000/api/auth/google'
        className='btn btn-google'
      >
        <i className='fab fa-google mr-1'></i> Log in with Google
      </a>
    </Fragment>
  );
};

export default GoogleLoginButton;
