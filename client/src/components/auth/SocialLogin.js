import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerSocial } from '../../actions/auth';

const SocialLogin = ({ registerSocial }) => {
  const url = new URL(window.location.href);
  const platform = url.searchParams.get('platform');

  useEffect(() => {
    try {
      registerSocial(platform);
    } catch (err) {
      console.err(err.message);
    }
  }, [registerSocial, platform]);

  return <Redirect to={'/explore'} />;
};

SocialLogin.propTypes = {
  registerSocial: PropTypes.func.isRequired,
};

export default connect(null, { registerSocial })(SocialLogin);
