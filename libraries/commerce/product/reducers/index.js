/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers } from 'redux';
import productsById from './productsById';
import currentProduct from './currentProduct';
import imagesByProductId from './imagesByProductId';
import descriptionsByProductId from './descriptionsByProductId';
import propertiesByProductId from './propertiesByProductId';
import shippingByProductId from './shippingByProductId';
import variantsByProductId from './variantsByProductId';
import optionsByProductId from './optionsByProductId';
import resultsByHash from './resultsByHash';

export default combineReducers({
  currentProduct,
  descriptionsByProductId,
  imagesByProductId,
  optionsByProductId,
  productsById,
  propertiesByProductId,
  resultsByHash,
  shippingByProductId,
  variantsByProductId,
});
