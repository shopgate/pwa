/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers } from 'redux';
import activeFilters from './activeFilters';
import activeHash from './activeHash';
import activeIndex from './activeIndex';
import availableFilters from './availableFilters';
import temporaryFilters from './temporaryFilters';

export default combineReducers({
  activeFilters,
  availableFilters,
  activeIndex,
  activeHash,
  temporaryFilters,
});
