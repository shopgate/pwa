/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { connect } from 'react-redux';
import createToast from '../../actions/toast/createToast';
import removeToast from '../../actions/toast/removeToast';
import { getToast } from '../../selectors/toast';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  toast: getToast(state),
});

/**
 * Maps dispatch to props.
 * @param {function} dispatch Dispatch.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  createToast: (options) => {
    dispatch(createToast(options));
  },
  removeToast: (id) => {
    dispatch(removeToast(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
