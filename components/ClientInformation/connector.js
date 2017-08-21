/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { enableDebugLogging } from './actions';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  client: {
    isFetching: state.client.isFetching,
    appVersion: state.client.appVersion,
    libVersion: state.client.libVersion,
    codebaseVersion: state.client.codebaseVersion,
    deviceId: state.client.deviceId,
  },
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  enableDebugLogging: () => dispatch(enableDebugLogging()),
});

export default connect(mapStateToProps, mapDispatchToProps);
