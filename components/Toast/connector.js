/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { connect } from 'react-redux';
import removeToast from '../../actions/toast/removeToast';
import { getToast, hasNextToast } from '../../selectors/toast';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  toast: getToast(state),
  hasNextToast: hasNextToast(state),
});

/**
 * Maps dispatch to props.
 * @param {function} dispatch Dispatch.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  removeToast: (id) => {
    dispatch(removeToast(id));
  },
  // Used for dispatching prepared action stored in a toast message.
  dispatchAction: action => dispatch(action),
});

export default connect(mapStateToProps, mapDispatchToProps);
