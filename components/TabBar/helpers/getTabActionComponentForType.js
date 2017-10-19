/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_MORE,
} from '../constants';
import TabBarAction from '../components/TabBarAction';
import TabBarHomeAction from '../components/HomeAction';
import TabBarBrowseAction from '../components/BrowseAction';
import TabBarCartAction from '../components/CartAction';
import TabBarMoreAction from '../components/MoreAction';

/**
 * Resolves the tab action component for a given type.
 * @param {string} type The type name of the tab.
 * @return {function|string} The corresponding component or the default tab action component.
 */
const getTabActionComponentForType = (type) => {
  switch (type) {
    case TAB_HOME:
      return TabBarHomeAction;
    case TAB_BROWSE:
      return TabBarBrowseAction;
    case TAB_CART:
      return TabBarCartAction;
    case TAB_MORE:
      return TabBarMoreAction;
    default:
      return TabBarAction;
  }
};

export default getTabActionComponentForType;
