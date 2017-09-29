/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import setViewLoading from '@shopgate/pwa-common/actions/view/setViewLoading';
import unsetViewLoading from '@shopgate/pwa-common/actions/view/unsetViewLoading';
import {
  searchRequesting$,
  searchReceived$,
} from '../streams';
import { SEARCH_PATH } from '../constants';

/**
 * Search subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchRequesting$, ({ dispatch }) => {
    dispatch(setViewLoading(SEARCH_PATH));
  });

  subscribe(searchReceived$, ({ dispatch }) => {
    dispatch(unsetViewLoading(SEARCH_PATH));
  });
}
