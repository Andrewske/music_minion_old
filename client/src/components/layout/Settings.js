import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import SpotifySettings from '../settings-forms/SpotifySettings';
//import LOADER from '../layout/Spinner'

const Settings = () => {
  return (
    <Fragment>
      <SpotifySettings />
    </Fragment>
  );
};

export default connect(null, null)(Settings);
