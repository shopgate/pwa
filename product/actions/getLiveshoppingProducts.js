/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getProducts from './getProducts';

/**
 * Retrieves the information for the liveshopping products widget.
 * @return {Function} A redux thunk.
 */
const getLiveshoppingProducts = () => (dispatch) => {
  dispatch(getProducts({
    pipeline: 'getLiveshoppingProducts',
    cached: false,
  }));
};

export default getLiveshoppingProducts;
