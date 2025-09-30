/* eslint-disable max-len */

/**
 * @typedef {import('./').ProductsWidgetInputConfig} ProductsWidgetInputConfig
 */

/**
 * @typedef {import('./').GetProductSearchParamsFromProductsInputConfigReturnValue} GetProductSearchParamsFromProductsInputConfigReturnValue
 */

/* eslint-enable max-len */

/**
 * Helper to extract relevant search parameters from the widget configuration of the "Products"
 * input.
 * The return value can be used to e.g. parametrize the useWidgetProducts hook.
 * @param {ProductsWidgetInputConfig} products Config object of the "Products" input.
 * @returns {GetProductSearchParamsFromProductsInputConfigReturnValue}
 */
export const getProductSearchParamsFromProductsInputConfig = (products = {}) => {
  const {
    type,
    brand,
    category,
    manualItemNumbers,
    selectorItemNumbers,
    searchTerm,
  } = products || {};

  let productsSearchType = type;

  /** @type {string|string[]} */
  let productsSearchValue = '';

  switch (type) {
    case 'brand':
      productsSearchValue = brand;
      break;
    case 'category':
      productsSearchValue = category;
      break;
    case 'manualItemNumbers':
      productsSearchValue = manualItemNumbers;
      break;
    case 'productSelector':
      productsSearchValue = selectorItemNumbers;
      break;
    case 'searchTerm':
    default:
      productsSearchValue = searchTerm;
  }

  if (['manualItemNumbers', 'productSelector'].includes(type)) {
    productsSearchType = 'productIds';
  }

  return {
    productsSearchType,
    productsSearchValue,
  };
};

/**
 * Parses the image URL to return a high resolution version if required.
 * @param {string} url The original image URL.
 * @param {boolean} useHighRes Whether to return a high resolution version.
 * @returns {string} The parsed image URL.
 */
export const parseImageUrl = (url, useHighRes) => {
  if (!url || !useHighRes) {
    return url;
  }

  const match = url.match(/^(.*)\.([^./]+)$/);

  return !match ? url : `${match[1]}@2x.${match[2]}`;
};
