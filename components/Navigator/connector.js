/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { isCurrentViewLoading } from '@shopgate/pwa-common/selectors/view';
import submitSearch from './actions/submitSearch';
import { isProgressBarShowing } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  backgroundColor: state.navigator.backgroundColor,
  filterOpen: state.navigator.filterOpen,
  navigatorEnabled: state.navigator.enabled,
  searchActive: state.navigator.searchActive,
  showSearch: state.navigator.showSearch,
  showTitle: state.navigator.showTitle,
  showLoadingBar: (isProgressBarShowing(state) && isCurrentViewLoading(state)),
  textColor: state.navigator.textColor,
});

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  submitSearch: () => dispatch(submitSearch()),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
