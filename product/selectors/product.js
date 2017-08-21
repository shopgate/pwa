import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { getSortOrder, getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { getActiveFilters } from '../../filter/selectors';
import { getCurrentCategoryId } from '../../category/selectors';

/**
 * Selects collection of all stored products from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of products.
 */
const getProducts = state => state.product.productsById;

/**
 * Retrieves the current product for the detail page from the store.
 * @param {Object} state The current application state.
 * @return {string} The id of the current product.
 */
export const getCurrentProductId = state =>
  state.currentProduct.productVariantId || state.currentProduct.productId;

/**
 * Retrieves a product by ID from state.
 * @param {Object} state The current application state.
 * @param {string} id The product ID.
 * @return {Object} The dedicated product.
 */
export const getProductById = (state, id) => getProducts(state)[id];

/**
 * Retrieves the current base product for the detail page from the store.
 * @param {Object} state The current application state.
 * @return {string} The id of the current base product.
 */
export const getCurrentBaseProductId = state => state.currentProduct.productId;

/**
 * Retrieves the current base product data from the store.
 * @param {Object} state The current application state.
 * @returns {Object} The current product.
 */
export const getCurrentBaseProduct = createSelector(
  getProducts,
  getCurrentBaseProductId,
  (products, productId) => {
    if (!products[productId] || products[productId].isFetching) {
      return null;
    }
    return products[productId].productData;
  }
);

/**
 * Retrieves the current product data from the store.
 * @param {Object} state The current application state.
 * @returns {Object} The current product.
 */
export const getCurrentProduct = createSelector(
  getProducts,
  getCurrentProductId,
  (products, productId) => {
    if (!products[productId] || products[productId].isFetching) {
      return null;
    }
    return products[productId].productData;
  }
);

/**
 * Retrieves the base price from a product.
 * @param {Object} state The application state.
 * @returns {number|null}
 */
export const getProductBasePrice = (state) => {
  const currentProduct = getCurrentProduct(state);
  if (!currentProduct) {
    return null;
  }

  return currentProduct.price.unitPrice;
};

/**
 * Retrieves the price currency from a product.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getProductCurrency = (state) => {
  const currentProduct = getCurrentProduct(state);
  if (!currentProduct) {
    return null;
  }

  return currentProduct.price.currency;
};

/**
 * Retrieves the generated result hash for a category ID.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {string} The result hash.
 */
const getResultHash = createSelector(
  getCurrentCategoryId,
  getSearchPhrase,
  getSortOrder,
  getActiveFilters,
  (categoryId, searchPhrase, sort, filters) => {
    if (categoryId) {
      return generateResultHash({
        categoryId,
        sort,
        ...filters && { filters },
      });
    }

    if (searchPhrase) {
      return generateResultHash({
        searchPhrase,
        sort,
        ...filters && { filters },
      });
    }

    return null;
  }
);

/**
 * Retrieves the result by hash.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The result.
 */
const getResultByHash = createSelector(
  state => state.product,
  getResultHash,
  (productState, hash) => productState.resultsByHash[hash]
);

/**
 * Populates the product result object.
 * @param {Object} state The application state.
 * @param {string} hash The result hash.
 * @param {Object} result The result.
 * @return {Object} The product result.
 */
export const getPopulatedProductsResult = (state, hash, result) => {
  const sort = getSortOrder(state);
  let products = [];
  let totalProductCount = !hash ? 0 : null;

  if (result) {
    totalProductCount = result.totalResultCount;

    if (result.products) {
      products = result.products.map(id => getProductById(state, id).productData);
    }
  }

  return {
    products,
    totalProductCount,
    sort,
  };
};

/**
 * Retrieves the populated product result.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The product result.
 */
export const getProductsResult = createSelector(
  state => state,
  getResultHash,
  getResultByHash,
  getPopulatedProductsResult
);

