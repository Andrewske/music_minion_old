import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerGoogle } from '../../actions/auth';

const SocialLogin = ({ registerGoogle }) => {
  const onClick = (e) => {
    e.preventDefault();
    console.log('Register Google');
    registerGoogle();
  };

  return (
    <Fragment>
      <button className='btn btn-spotify' onClick={(e) => onClick(e)}>
        <i className='fa fa-spotify mr-1'></i> Log In with Spotify
      </button>
      {/* <button className='btn btn-google' onClick={(e) => onClick(e)}>
        <i className='fab fa-google mr-1'></i> Log in with Google
      </button> */}
      <a
        href='http://localhost:5000/api/auth/google'
        className='btn btn-google'
      >
        <i className='fab fa-google mr-1'></i> Log in with Google
      </a>
    </Fragment>
  );
};

SocialLogin.propTypes = {
  registerGoogle: PropTypes.func.isRequired,
};

export default connect(null, { registerGoogle })(SocialLogin);
