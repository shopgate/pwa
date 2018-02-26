/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// FEATURES
const CATEGORY = 'category';
const PRODUCT = 'product';

// CONTENTS
const LIST = 'list';
const LIST_ITEM = 'list-item';
const ITEM = 'item';
const IMAGE = 'image';
const NAME = 'name';

// POSITIONS
const BEFORE = 'before';
const AFTER = 'after';

export const CATEGORY_LIST = `${CATEGORY}.${LIST}`;
export const CATEGORY_LIST_BEFORE = `${CATEGORY}.${LIST}.${BEFORE}`;
export const CATEGORY_LIST_AFTER = `${CATEGORY}.${LIST}.${AFTER}`;

export const CATEGORY_LIST_ITEM = `${CATEGORY}.${LIST_ITEM}`;

export const PRODUCT_LIST = `${PRODUCT}.${LIST}`;
export const PRODUCT_LIST_BEFORE = `${PRODUCT}.${LIST}.${BEFORE}`;
export const PRODUCT_LIST_AFTER = `${PRODUCT}.${LIST}.${AFTER}`;

export const PRODUCT_LIST_ITEM_BEFORE = `${PRODUCT}.${LIST_ITEM}.${BEFORE}`;
export const PRODUCT_LIST_ITEM = `${PRODUCT}.${LIST_ITEM}`;
export const PRODUCT_LIST_ITEM_AFTER = `${PRODUCT}.${LIST_ITEM}.${AFTER}`;

export const PRODUCT_ITEM_IMAGE = `${PRODUCT}-${ITEM}.${IMAGE}`;
export const PRODUCT_ITEM_IMAGE_BEFORE = `${PRODUCT}-${ITEM}.${IMAGE}.${BEFORE}`;
export const PRODUCT_ITEM_IMAGE_AFTER = `${PRODUCT}-${ITEM}.${IMAGE}.${AFTER}`;

export const PRODUCT_ITEM_NAME = `${PRODUCT}-${ITEM}.${NAME}`;
export const PRODUCT_ITEM_NAME_BEFORE = `${PRODUCT}-${ITEM}.${NAME}.${BEFORE}`;
export const PRODUCT_ITEM_NAME_AFTER = `${PRODUCT}-${ITEM}.${NAME}.${AFTER}`;
