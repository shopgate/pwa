/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { getHistoryLocation } from '@shopgate/pwa-common/selectors/history';

/**
 * Maps the current state to the component props.
 * @param {Object} state The current application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  path: getHistoryLocation(state),
});

export default connect(mapStateToProps);
