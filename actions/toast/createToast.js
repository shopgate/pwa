/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import createToast from '../../action-creators/toast/createToast';

/**
 * The toast defaults.
 * @type {Object}
 */
const defaultToastOptions = {
  id: null,
  message: null,
  timeout: 5000,
};

/**
 * Creates toast action.
 * @param {Object} options Options.
 * @returns {function}
 */
const createToastAction = options => (dispatch) => {
  dispatch(createToast({
    ...defaultToastOptions,
    ...options,
  }));
};

export default createToastAction;
