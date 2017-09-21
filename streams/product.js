/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  RECEIVE_PRODUCTS,
  SET_PRODUCT_ID,
  RECEIVE_PRODUCT_DESCRIPTION,
  RECEIVE_PRODUCT_PROPERTIES,
  RECEIVE_PRODUCT_SHIPPING,
} from '@shopgate/pwa-common-commerce/product/constants';
import {
  getCurrentProduct,
  getProductDescription,
  getProductProperties,
  getProductShipping,
} from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Emits when product results has been received.
 */
export const productsReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCTS);

/**
 * Emits when the current product id changed.
 */
const productIdChanged$ = main$
  .filter(
    ({ action }) => (
      action.type === SET_PRODUCT_ID &&
      !!action.productId
    )
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
const dataLoaded$ = productIdChanged$
  .zip(
    descriptionReceived$,
    propertiesReceived$,
    shippingReceived$
  )
  .map(([first]) => first);

/**
 * Emits when a category's data is already available.
 */
const dataPreloaded$ = productIdChanged$
  .filter(
    ({ getState }) => (
      getCurrentProduct(getState()) &&
      getProductDescription(getState()) &&
      getProductProperties(getState()) &&
      getProductShipping(getState())
  ));

/**
 * Emits when a category is ready to be tracked,
 * considering loaded or preloaded data.
 */
export const productIsReady$ = dataLoaded$.merge(dataPreloaded$);
