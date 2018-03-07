/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Handles the received category id's by mapping to store and returning results.
 * @param {Array} categories The received categories.
 * @returns {Array} An array of category objects.
 */
const handleReceivedCategories = categories => (
  categories.length ? categories.map(category => category.id) : null
);

export default handleReceivedCategories;
