import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerGoogle } from '../../actions/auth';

const GoogleLogin = ({ registerGoogle }) => {
  useEffect(() => {
    try {
      registerGoogle();
    } catch (err) {
      console.err(err.message);
    }
  }, []);

  return <Redirect to={'/'} />;
};

GoogleLogin.propTypes = {
  registerGoogle: PropTypes.func.isRequired,
};

export default connect(null, { registerGoogle })(GoogleLogin);
