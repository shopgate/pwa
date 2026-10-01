import React from 'react';
/* eslint-disable import/named, no-unused-vars */
import {
  ProductListTypeContextType,
  ProductListTypeContextSubType,
} from '../ProductListType/context';
/* eslint-enable import/named, no-unused-vars */

/**
 * @typedef ProductListEntryContextValue
 * @property {string} productId A product identifier.
 * @property {ProductListTypeContextType} [productListType=null] Type of the active
 * ProductListTypeContext e.g. "productSlider" or "productGrid".
 * @property {ProductListTypeContextSubType} [productListSubType=null] Optional sub type of the
 * active ProductListTypeContext. Depending on its usage it can make a statement about in which
 * context the product list is used e.g. "widgets".
 */
export {};

export default React.createContext({
  productListType: null,
  productListSubType: null,
  productId: null,
});

