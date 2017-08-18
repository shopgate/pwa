/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import connect from '@shopgate/pwa-common/helpers/routedConnect';
import { updateHistoryState } from '@shopgate/pwa-common/actions/history';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  viewTop: state.history.state.viewTop,
});

/**
 * Connects the dispatch function to a calleble function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  updateHistoryState(state) {
    dispatch(updateHistoryState(state));
  },
});

/**
 * Connects a component to the view store.
 * @param {Object} Component A react component.
 * @return {Object} The react component with extended props.
 */
const view = Component =>
  connect(mapStateToProps, mapDispatchToProps)(Component)
;

export default view;
