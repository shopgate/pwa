/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { goBackHistory } from '@shopgate/pwa-common/actions/history/changeHistory';
import fetchRegisterUrl from '@shopgate/pwa-common/actions/user/fetchRegisterUrl';
import { getRegisterUrl } from '@shopgate/pwa-common/selectors/user';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  hasRegisterUrl: !!getRegisterUrl(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchRegisterUrl: () => dispatch(fetchRegisterUrl()),
  goBackHistory: number => dispatch(goBackHistory(number)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
