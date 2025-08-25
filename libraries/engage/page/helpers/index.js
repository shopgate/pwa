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
    productSelectorType,
    productsBrand,
    productsCategory,
    productsItemNumbers,
    productsManualItemNumbers,
    productsSelectorItemNumbers,
    productsSearchTerm,
  } = products || {};

  let productsSearchType = productSelectorType;

  /** @type {string|string[]} */
  let productsSearchValue = '';

  switch (productSelectorType) {
    case 'brand':
      productsSearchValue = productsBrand;
      break;
    case 'category':
      productsSearchValue = productsCategory;
      break;
    // Kept for backward compatibility - was replaces by 'manualItemNumbers' and 'productSelector'
    case 'itemNumbers':
      productsSearchValue = productsItemNumbers.split(',').map(item => item.trim());
      break;
    case 'manualItemNumbers':
      productsSearchValue = productsManualItemNumbers;
      break;
    case 'productSelector':
      productsSearchValue = productsSelectorItemNumbers;
      break;
    case 'searchTerm':
    default:
      productsSearchValue = productsSearchTerm;
  }

  if (['itemNumbers', 'manualItemNumbers', 'productSelector'].includes(productSelectorType)) {
    productsSearchType = 'productIds';
  }

  return {
    productsSearchType,
    productsSearchValue,
  };
};
