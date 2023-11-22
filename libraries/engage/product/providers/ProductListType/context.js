import React from 'react';

/* eslint-disable max-len */
/**
 * @typedef {"productSlider"|"productGrid"|"productList"|"favoritesList"|"cart"|"liveshopping"|"pdp"|"productGallery"} ProductListTypeContextType
 */

/**
 * @typedef {"widgets"|"category"} ProductListTypeContextSubType
 */

/* eslint-enable max-len */

/**
 * @typedef ProductListTypeContextValue
 * @property {ProductListTypeContextType} [type=null] Type of the active ProductListTypeContext
 * e.g. "productSlider" or "productGrid".
 * @property {ProductListTypeContextSubType} [subType=null] Optional sub type of the active
 * ProductListTypeContext. Depending on its usage it can make a statement about in which context
 * the product list is used e.g. "widgets".
 */
export {};

export default React.createContext({
  type: null,
  subType: null,
});

