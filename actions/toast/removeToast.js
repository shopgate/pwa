/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import removeToast from '../../action-creators/toast/removeToast';

/**
 * Remove action.
 * @param {number} id Id.
 * @returns {function}
 */
const removeToastAction = id => (dispatch) => {
  dispatch(removeToast(id));
};

export default removeToastAction;
