/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// FEATURES
const PRODUCT_ITEM = 'product-item';
const PRODUCT = 'product';

// CONTENTS
const CTAS = 'ctas';
const RATING = 'rating';
const NAME = 'name';
const INFO = 'info';
const MANUFACTURER = 'manufacturer';
const SHIPPING = 'shipping';
const AVAILABILITY = 'availability';
const PRICE_STRIKED = 'priceStriked';
const PRICE = 'price';
const PRICE_INFO = 'priceInfo';
const TIERS = 'tiers';

// POSITIONS
const BEFORE = 'before';
const AFTER = 'after';
const ROW1 = 'row1';
const ROW2 = 'row2';

export const PRODUCT_ITEM_NAME_BEFORE = `${PRODUCT_ITEM}.${NAME}.${BEFORE}`;

export const PRODUCT_CTAS_BEFORE = `${PRODUCT}.${CTAS}.${BEFORE}`;
export const PRODUCT_CTAS = `${PRODUCT}.${CTAS}`;
export const PRODUCT_CTAS_AFTER = `${PRODUCT}.${CTAS}.${AFTER}`;

export const PRODUCT_RATING_BEFORE = `${PRODUCT}.${RATING}.${BEFORE}`;
export const PRODUCT_RATING = `${PRODUCT}.${RATING}`;
export const PRODUCT_RATING_AFTER = `${PRODUCT}.${RATING}.${AFTER}`;

export const PRODUCT_NAME_BEFORE = `${PRODUCT}.${NAME}.${BEFORE}`;
export const PRODUCT_NAME = `${PRODUCT}.${NAME}`;
export const PRODUCT_NAME_AFTER = `${PRODUCT}.${NAME}.${AFTER}`;

export const PRODUCT_INFO_BEFORE = `${PRODUCT}.${INFO}.${BEFORE}`;
export const PRODUCT_INFO = `${PRODUCT}.${INFO}`;
export const PRODUCT_INFO_ROW1 = `${PRODUCT}.${INFO}.${ROW1}`;
export const PRODUCT_INFO_ROW2 = `${PRODUCT}.${INFO}.${ROW2}`;
export const PRODUCT_INFO_AFTER = `${PRODUCT}.${INFO}.${AFTER}`;

export const PRODUCT_MANUFACTURER_BEFORE = `${PRODUCT}.${MANUFACTURER}.${BEFORE}`;
export const PRODUCT_MANUFACTURER = `${PRODUCT}.${MANUFACTURER}`;
export const PRODUCT_MANUFACTURER_AFTER = `${PRODUCT}.${MANUFACTURER}.${AFTER}`;

export const PRODUCT_SHIPPING_BEFORE = `${PRODUCT}.${SHIPPING}.${BEFORE}`;
export const PRODUCT_SHIPPING = `${PRODUCT}.${SHIPPING}`;
export const PRODUCT_SHIPPING_AFTER = `${PRODUCT}.${SHIPPING}.${AFTER}`;

export const PRODUCT_AVAILABILITY_BEFORE = `${PRODUCT}.${AVAILABILITY}.${BEFORE}`;
export const PRODUCT_AVAILABILITY = `${PRODUCT}.${AVAILABILITY}`;
export const PRODUCT_AVAILABILITY_AFTER = `${PRODUCT}.${AVAILABILITY}.${AFTER}`;

export const PRODUCT_PRICE_STRIKED_BEFORE = `${PRODUCT}.${PRICE_STRIKED}.${BEFORE}`;
export const PRODUCT_PRICE_STRIKED = `${PRODUCT}.${PRICE_STRIKED}`;
export const PRODUCT_PRICE_STRIKED_AFTER = `${PRODUCT}.${PRICE_STRIKED}.${AFTER}`;

export const PRODUCT_PRICE_BEFORE = `${PRODUCT}.${PRICE}.${BEFORE}`;
export const PRODUCT_PRICE = `${PRODUCT}.${PRICE}`;
export const PRODUCT_PRICE_AFTER = `${PRODUCT}.${PRICE}.${AFTER}`;

export const PRODUCT_PRICE_INFO_BEFORE = `${PRODUCT}.${PRICE_INFO}.${BEFORE}`;
export const PRODUCT_PRICE_INFO = `${PRODUCT}.${PRICE_INFO}`;
export const PRODUCT_PRICE_INFO_AFTER = `${PRODUCT}.${PRICE_INFO}.${AFTER}`;

export const PRODUCT_TIERS_BEFORE = `${PRODUCT}.${TIERS}.${BEFORE}`;
export const PRODUCT_TIERS = `${PRODUCT}.${TIERS}`;
export const PRODUCT_TIERS_AFTER = `${PRODUCT}.${TIERS}.${AFTER}`;
