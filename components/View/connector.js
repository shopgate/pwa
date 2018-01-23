/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import setViewTitle from './action-creators/setViewTitle';
import setViewTop from './action-creators/setViewTop';
import { getTopStatus, getTitle } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  navigatorTitle: getTitle(state),
  historyPathname: getHistoryPathname(state),
  viewTop: getTopStatus(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  setTitle: title => dispatch(setViewTitle(title)),
  setTop: isTop => dispatch(setViewTop(isTop)),
});

export default connect(mapStateToProps, mapDispatchToProps);
