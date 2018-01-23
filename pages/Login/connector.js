/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import connect from '@shopgate/pwa-common/components/Router/helpers/connect';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import login from '@shopgate/pwa-common/actions/user/login';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isLoading: isViewLoading(state, LOGIN_PATH),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  login: credentials => dispatch(login(credentials)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
