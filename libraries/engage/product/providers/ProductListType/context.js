import React from 'react';
/**
 * @typedef ProductListTypeContextValue
 * @property {string} [type=null] Type of the currently active ProductListTypeContext
 * e.g. "productSlider" or "productGrid".
 * @property {string} [subType=null] Optional sub type of the currently active
 * ProductListTypeContext. Depending on its usage it can make a statement about in which context
 * the product list is used e.g. "widgets".
 */
export {};

export default React.createContext({
  type: null,
  subType: null,
});

