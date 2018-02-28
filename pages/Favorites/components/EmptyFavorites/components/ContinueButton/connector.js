/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';
import connect from '@shopgate/pwa-common/components/Router/helpers/connect/index';

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBackHistory: () => dispatch(goBackHistory(1)),
});

export default connect(null, mapDispatchToProps);
