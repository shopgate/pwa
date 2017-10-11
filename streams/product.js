/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeDidNotChange } from '@shopgate/pwa-common/streams/history';
import {
  RECEIVE_PRODUCTS,
  RECEIVE_PRODUCT,
  SET_PRODUCT_ID,
  RECEIVE_PRODUCT_DESCRIPTION,
  RECEIVE_PRODUCT_PROPERTIES,
  RECEIVE_PRODUCT_SHIPPING,
  ITEM_PATH,
} from '@shopgate/pwa-common-commerce/product/constants';
import {
  getCurrentProduct,
  getCurrentBaseProductId,
  getProductDescription,
  getProductProperties,
  getProductShipping,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  isProductChildrenSelected,
} from '@shopgate/pwa-common-commerce/product/selectors/variants';

/**
 * Emits when product results has been received.
 */
export const productsReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCTS);

/**
 * Emits when product result has been received.
 */
export const productReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT);

/**
 * Emits when the current product id changed.
 */
const productIdChanged$ = main$
  .filter(
    ({ action, prevState }) => {
      const prevId = getCurrentBaseProductId(prevState);
      return (
        action.type === SET_PRODUCT_ID &&
        !!action.productId &&
        action.productId !== prevId
      );
    }
  );

/**
 * Emits when specific product data has been received.
 */
const descriptionReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT_DESCRIPTION);

const propertiesReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT_PROPERTIES);

const shippingReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT_SHIPPING);

/**
 * Emits when all necessary category data has been received.
 */
export const dataLoaded$ = productIdChanged$
  .zip(
    descriptionReceived$,
    propertiesReceived$,
    shippingReceived$
  )
  .map(([first]) => first)
  .switchMap((data) => {
    const product = getCurrentProduct(data.getState());

    // Return the productReceived$ stream if the product data are not there yet
    if (!product) {
      return productReceived$;
    }

    // Return a new stream that just emits with the current data
    return Observable.of(data);
  })
  .filter(({ getState }) => !isProductChildrenSelected(getState()));

/**
 * Emits when product page is entered.
 */
const productRouteEntered$ = routeDidNotChange(ITEM_PATH);

/**
 * Emits when product data are already available.
 */
export const dataPreloaded$ = productRouteEntered$
  .switchMap(() => (
    productIdChanged$
      .filter(
        ({ getState }) => {
          const state = getState();
          // TODO: improve these checks here if there was a response like [], '', {}, null.
          // Like the code is now, it won't work for products without properties etc
          return (
            getCurrentProduct(state) &&
            getProductDescription(state) &&
            getProductProperties(state) &&
            getProductShipping(state)
          );
        })
    )
  );
/**
 * Emits when a product page is ready to be tracked, considering loaded or preloaded data.
 */
export const productIsReady$ = dataLoaded$.merge(dataPreloaded$);
