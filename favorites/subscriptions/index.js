/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import {
  favoritesDidEnter$,
  favoritesDidEnterWithProducts$,
} from '../streams';
import getProductVariants from '../../product/actions/getProductVariants';
import { getFavoritesBaseProductIds } from '../selectors';
import getFavorites from '../actions/getFavorites';

/**
 * Dispatches fetch action.
 * Callback for all subscriptions which should end up in
 * fetching favorites.
 * @param {function} dispatch Dispatch.
 */
const dispatchFetch = ({ dispatch }) => {
  dispatch(getFavorites());
};

/**
 * Favorites page subscriptions.
 * @param {function} subscribe Subscribe function.
 */
const favorites = (subscribe) => {
  // On App start.
  subscribe(appDidStart$, dispatchFetch);
  // On page enter.
  subscribe(favoritesDidEnter$, dispatchFetch);

  // On page enter AND received.
  subscribe(favoritesDidEnterWithProducts$, (values) => {
    const [{ dispatch, getState }] = values.slice(-1);
    getFavoritesBaseProductIds(getState()).forEach((productId) => {
      dispatch(getProductVariants(productId));
    });
  });
};

export default favorites;
