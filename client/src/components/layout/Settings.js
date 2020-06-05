import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SpotifySettings from '../settings-forms/SpotifySettings';
//import LOADER from '../layout/Spinner'

const Settings = () => {
  return (
    <Fragment>
      <SpotifySettings />
    </Fragment>
  );
};

Settings.propTypes = {};

export default connect(null, null)(Settings);
