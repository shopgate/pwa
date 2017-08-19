/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { goBackHistory } from '@shopgate/pwa-common/history/actions';
import { logo } from 'Config/app.json';
import { setSearchPhrase, toggleSearch } from './action-creators';
import setNavigatorBackground from './actions/setNavigatorBackground';
import setNavigatorColor from './actions/setNavigatorColor';
import enableNavigatorIconShadow from './actions/enableNavigatorIconShadow';
import disableNavigatorIconShadow from './actions/disableNavigatorIconShadow';
import enableNavigatorSearch from './actions/enableNavigatorSearch';
import disableNavigatorSearch from './actions/disableNavigatorSearch';
import enableNavigatorTitle from './actions/enableNavigatorTitle';
import disableNavigatorTitle from './actions/disableNavigatorTitle';
import enableNavigator from './actions/enableNavigator';
import disableNavigator from './actions/disableNavigator';
import submitSearch from './actions/submitSearch';
import toggleNavDrawer from './actions/toggleNavDrawer';
import { isCurrentViewLoading } from '../View/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  action: state.history.action,
  backgroundColor: state.navigator.backgroundColor,
  textColor: state.navigator.textColor,
  historyLength: state.history.length,
  logoUrl: logo,
  path: state.history.pathname,
  title: state.history.state.title || '',
  searchActive: state.navigator.searchActive,
  searchPhrase: state.navigator.searchPhrase,
  showIconShadow: state.navigator.showIconShadow,
  showCartIcon: state.navigator.showCartIcon,
  showSearch: state.navigator.showSearch,
  showTitle: state.navigator.showTitle,
  showLoadingBar: isCurrentViewLoading(state),
  navDrawerActive: state.navigator.navDrawerActive,
  navigatorEnabled: state.navigator.enabled,
  filterOpen: state.navigator.filterOpen,
  filterAttributeOpen: state.navigator.filterAttributeOpen,
  loginOpen: state.navigator.loginOpen,
});

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  setSearchPhrase: query => dispatch(setSearchPhrase(query)),
  submitSearch: () => dispatch(submitSearch()),
  goBackHistory: (amount = 1) => dispatch(goBackHistory(amount)),
  toggleSearch: active => dispatch(toggleSearch(active)),
  toggleNavDrawer: active => dispatch(toggleNavDrawer(active)),
  setNavigatorBackground: color => dispatch(setNavigatorBackground(color)),
  setNavigatorColor: color => dispatch(setNavigatorColor(color)),
  enableNavigatorIconShadow: () => dispatch(enableNavigatorIconShadow()),
  disableNavigatorIconShadow: () => dispatch(disableNavigatorIconShadow()),
  enableNavigatorSearch: () => dispatch(enableNavigatorSearch()),
  disableNavigatorSearch: () => dispatch(disableNavigatorSearch()),
  enableNavigatorTitle: () => dispatch(enableNavigatorTitle()),
  disableNavigatorTitle: () => dispatch(disableNavigatorTitle()),
  disableNavigator: () => dispatch(disableNavigator()),
  enableNavigator: () => dispatch(enableNavigator()),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
