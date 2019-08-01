/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// FEATURES
const NAV_MENU = 'nav-menu';

// CONTENTS
const FAVORITES = 'favorites';
const ADD_TO_CART = 'add-to-cart';
const AVAILABILITY_TEXT = 'availability-text';
const PRODUCT_NAME = 'product-name';
const PRODUCT_PRICE = 'product-price';
const EMPTY = 'empty';

// POSITIONS
const BEFORE = 'before';
const AFTER = 'after';

export const NAV_MENU_FAVORITES_BEFORE = `${NAV_MENU}.${FAVORITES}.${BEFORE}`;
export const NAV_MENU_FAVORITES = `${NAV_MENU}.${FAVORITES}`;
export const NAV_MENU_FAVORITES_AFTER = `${NAV_MENU}.${FAVORITES}.${AFTER}`;

export const FAVORITES_ADD_TO_CART_BEFORE = `${FAVORITES}.${ADD_TO_CART}.${BEFORE}`;
export const FAVORITES_ADD_TO_CART = `${FAVORITES}.${ADD_TO_CART}`;
export const FAVORITES_ADD_TO_CART_AFTER = `${FAVORITES}.${ADD_TO_CART}.${AFTER}`;

export const FAVORITES_PRODUCT_NAME_BEFORE = `${FAVORITES}.${PRODUCT_NAME}.${BEFORE}`;
export const FAVORITES_PRODUCT_NAME = `${FAVORITES}.${PRODUCT_NAME}`;
export const FAVORITES_PRODUCT_NAME_AFTER = `${FAVORITES}.${PRODUCT_NAME}.${AFTER}`;

export const FAVORITES_PRODUCT_PRICE_BEFORE = `${FAVORITES}.${PRODUCT_PRICE}.${BEFORE}`;
export const FAVORITES_PRODUCT_PRICE = `${FAVORITES}.${PRODUCT_PRICE}`;
export const FAVORITES_PRODUCT_PRICE_AFTER = `${FAVORITES}.${PRODUCT_PRICE}.${AFTER}`;

export const FAVORITES_AVAILABILITY_TEXT_BEFORE = `${FAVORITES}.${AVAILABILITY_TEXT}.${BEFORE}`;
export const FAVORITES_AVAILABILITY_TEXT = `${FAVORITES}.${AVAILABILITY_TEXT}`;
export const FAVORITES_AVAILABILITY_TEXT_AFTER = `${FAVORITES}.${AVAILABILITY_TEXT}.${AFTER}`;

export const FAVORITES_EMPTY = `${FAVORITES}.${EMPTY}`;
