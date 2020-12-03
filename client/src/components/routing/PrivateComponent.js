import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateComponent = ({
  component: Component,
  auth: { isAuthenticated },
  ...rest
}) => !isAuthenticated && <Component />;

PrivateComponent.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateComponent);
