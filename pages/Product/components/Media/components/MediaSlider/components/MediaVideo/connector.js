import { connect } from 'react-redux';
import { getClientConnectivityType } from '@shopgate/engage/core';
import config from './config';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  autoPlay: config.autoPlay[getClientConnectivityType(state)] || false,
});

export default connect(mapStateToProps);
