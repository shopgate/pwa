/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as actionTypes from './constants';

/**
 * Dispatches the INCREMENT_ACTION_COUNT action.
 * @return {Object}
 */
export const incrementActionCount = () => ({
  type: actionTypes.INCREMENT_ACTION_COUNT,
});

/**
 * Dispatches the DECREMENT_ACTION_COUNT action.
 * @return {Object}
 */
export const decrementActionCount = () => ({
  type: actionTypes.DECREMENT_ACTION_COUNT,
});

/**
 * Dispatches the INCREMENT_ACTION_COUNT action.
 * @return {Object}
 */
export const resetActionCount = () => ({
  type: actionTypes.RESET_ACTION_COUNT,
});
