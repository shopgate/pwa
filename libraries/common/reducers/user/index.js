/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers } from 'redux';
import login from './login';
import data from './data';
import { persist } from '../../store/persistent';

/**
 * The current version of the state created by this reducer.
 * @type {string}
 */
const STATE_VERSION = 'v1';

export default persist(
  'user',
  combineReducers({
    login,
    data,
  }),
  STATE_VERSION
);
