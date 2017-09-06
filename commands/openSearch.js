/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import showTab from './showTab';

/**
 * Opens the search tab via the showTab app command.
 */
export default () => {
  showTab({
    targetTab: 'app_search',
  });
};
