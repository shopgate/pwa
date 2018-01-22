/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';
import toggleNavDrawer from '../../actions/toggleNavDrawer';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  action: state.history.action,
  filterOpen: state.navigator.filterOpen,
  filterAttributeOpen: state.navigator.filterAttributeOpen,
  loginOpen: state.navigator.loginOpen,
  path: state.history.pathname,
  showIconShadow: state.navigator.showIconShadow,
});

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBackHistory: (amount = 1) => dispatch(goBackHistory(amount)),
  toggleNavDrawer: active => dispatch(toggleNavDrawer(active)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
