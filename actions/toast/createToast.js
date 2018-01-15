/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import createToast from '../../action-creators/toast/createToast';

/**
 * Creates toast action.
 * @param {Object} options Options.
 * @returns {function}
 */
const createToastAction = options => (dispatch) => {
  dispatch(createToast(options));
};

export default createToastAction;
