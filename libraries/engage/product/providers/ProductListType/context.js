import React from 'react';

/* eslint-disable max-len */
/**
 * @typedef {"productSlider"|"productGrid"|"productList"|"favoritesList"|"cart"|"liveshopping"|"pdp"|"productGallery"} ProductListTypeContextType
 */
export {};

/**
 * @typedef {"widgets"|"category"} ProductListTypeContextSubType
 */
export {};

/* eslint-enable max-len */

/**
 * @typedef ProductListTypeContextValue
 * @property {ProductListTypeContextType} [type=null] Type of the active ProductListTypeContext
 * e.g. "productSlider" or "productGrid".
 * @property {ProductListTypeContextSubType} [subType=null] Optional sub type of the active
 * ProductListTypeContext. Depending on its usage it can make a statement about in which context
 * the product list is used e.g. "widgets".
 * @property {Object} [meta=null] Optional meta information that can be used by child components
 */
export {};

export default React.createContext({
  type: null,
  subType: null,
  meta: null,
});

