/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import { hasActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * Checks if the filter bar has active filters
 * @return {bool}
 */
export const isFilterBarActive = createSelector(
  hasActiveFilters,
  activeFilters => activeFilters
);
