/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getProducts from './getProducts';

/**
 * Maybe requests highlight products from server.
 * @param {Object} options The options for the getProducts request.
 * @param {Object} options.params The params for the getHighlightProducts pipeline.
 * @param {string} [options.id=null] A unique id for the component that is using this action.
 * @return {Function} The dispatched action.
 */
const getHighlightProducts = ({ params, id = null }) => (dispatch) => {
  dispatch(getProducts({
    pipeline: 'getHighlightProducts',
    params,
    id,
    includeSort: false,
    includeFilters: false,
  }));
};

export default getHighlightProducts;
