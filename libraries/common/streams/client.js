/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_CLIENT_INFORMATION } from '../constants/ActionTypes';
import { main$ } from './main';

/**
 * Gets triggered after the client information was updated
 * @type {Observable}
 */
export const clientInformationDidUpdate$ = main$
  .filter(({ action }) => action.type === RECEIVE_CLIENT_INFORMATION);
