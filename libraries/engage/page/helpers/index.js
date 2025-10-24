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
    brand,
    category,
    manualItemNumbers,
    selectorItemNumbers,
    searchTerm,
  } = products || {};

  const mapping = [
    ['brand', brand],
    ['category', category],
    ['searchTerm', searchTerm],
    ['productIds', manualItemNumbers],
    ['productIds', selectorItemNumbers],
  ];

  // Pick the first non-undefined value
  // eslint-disable-next-line prefer-const
  let [productsSearchType, productsSearchValue] =
    mapping.find(([, value]) => value !== undefined) || ['searchTerm', searchTerm];

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

/**
 * Retrieves the border radius based on the widget config
 * @param {Object} params The helper parameters.
 * @param {"default"|"none"|"rounded"|"custom"} params.borderRadius The border radius option.
 * @param {number} params.borderRadiusCustom The custom border radius value.
 * @returns {number} The resolved border radius.
 */
export const resolveBorderRadiusFromWidgetConfig = ({ borderRadius, borderRadiusCustom }) => {
  if (borderRadius === 'none') return 0;
  if (borderRadius === 'rounded') return 16;
  if (borderRadius === 'custom' && typeof borderRadiusCustom === 'number') return borderRadiusCustom;
  return 0;
};
