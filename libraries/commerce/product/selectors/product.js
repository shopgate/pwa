import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { isUndefined } from '@shopgate/pwa-common/helpers/validation';
import {
  getSortOrder,
  getSearchPhrase,
  getHistoryPathname,
} from '@shopgate/pwa-common/selectors/history';
import { ITEM_PATH } from '../constants';
import { getActiveFilters } from '../../filter/selectors';
import { getCurrentCategoryId } from '../../category/selectors';
import { filterProperties } from '../helpers';

/**
 * Selects all products from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of products.
 */
export const getProducts = state => state.product.productsById;

/**
 * Retrieves the current product or variant page from the store.
 * @param {Object} state The current application state.
 * @return {string} The id of the current product.
 */
export const getCurrentProductId = state =>
  state.product.currentProduct.productVariantId || state.product.currentProduct.productId;

/**
 * Gets the product id from the current history state pathname.
 * @param {Object} state The current application state.
 * @return {null|string} Product id or null
 */
export const getHistoryPathProductId = createSelector(
  getHistoryPathname,
  (pathname) => {
    if (!pathname.startsWith(ITEM_PATH)) {
      return null;
    }

    const pathSegments = pathname.split('/');
    if (!pathSegments[2]) {
      return null;
    }

    return hex2bin(pathSegments[2]);
  }
);

/**
 * Retrieves a product by ID from state.
 * @param {Object} state The current application state.
 * @param {string} id The product ID.
 * @return {Object} The dedicated product.
 */
export const getProductById = (state, id) => getProducts(state)[id];

/**
 * Retrieves the current base product page from the store.
 * @param {Object} state The current application state.
 * @return {string|null} The id of the current base product.
 */
export const getCurrentBaseProductId = state => state.product.currentProduct.productId;

/**
 * Retrieves the current base product data from the store.
 * @param {Object} state The current application state.
 * @returns {Object} The current product.
 */
export const getCurrentBaseProduct = createSelector(
  getCurrentBaseProductId,
  getProducts,
  (productId, products) => {
    const entry = products[productId];
    if (!entry || entry.isFetching || isUndefined(entry.productData)) {
      return null;
    }

    return entry.productData;
  }
);

/**
 * Retrieves the current product data from the store.
 * @param {Object} state The current application state.
 * @returns {Object} The current product.
 */
export const getCurrentProduct = createSelector(
  getCurrentProductId,
  getProducts,
  (productId, products) => {
    const entry = products[productId];
    // No return null when data is there but product data is updating.
    if (!entry || isUndefined(entry.productData)) {
      return null;
    }

    return entry.productData;
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

  if (result && result.products) {
    totalProductCount = result.totalResultCount;
    products = result.products.map(id => getProductById(state, id).productData);
  }

  return {
    products,
    totalProductCount,
    sort,
    hash,
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

/**
 * Retrieves the current product name.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductName = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.name;
  }
);

/**
 * Selects the product images state.
 * @param {Object} state The current application state.
 * @return {Object} The product images state.
 */
export const getProductImagesState = state => state.product.imagesByProductId;

/**
 * Retrieves the current product images or the images of the parent product.
 * If the current product does not have images, we try to select the images from the base product.
 * @param {Object} state The current application state.
 * @return {Array|null}
 */
export const getProductImages = createSelector(
  getCurrentProductId,
  getCurrentBaseProductId,
  getProductImagesState,
  (productId, baseProductId, images) => {
    let entry = images[productId];
    const productImages = images[productId];

    /**
     * Check if there are any images.
     * If not then default back to the base product's images.
     */
    if (!productImages || !productImages.images || !productImages.images.length) {
      entry = images[baseProductId];
    }

    if (!entry || entry.isFetching || isUndefined(entry.images)) {
      return null;
    }

    return entry.images;
  }
);

/**
 * Selects the product images state.
 * @param {Object} state The current application state.
 * @return {Object} The product images state.
 */
const getProductImagesResolutionsState = state => state.product.imagesResolutionsByProductId;

/**
 * Retrieves the current product images or the images of the parent product.
 * If the current product does not have images, we try to select the images from the base product.
 * @param {Object} state The current application state.
 * @return {Array|null}
 */
export const getProductImagesResolutions = createSelector(
  getCurrentProductId,
  getCurrentBaseProductId,
  getProductImagesResolutionsState,
  (productId, baseProductId, images) => {
    let entry = images[productId];

    const noImages = entry && Object.hasOwnProperty.call(entry, 'resolutions') && Object.keys(entry.resolutions).length === 0;

    /**
     * Check if there are any images.
     * If not then default back to the base product's images.
     */
    if (noImages) {
      entry = images[baseProductId];
    }

    if (!entry || entry.isFetching || !entry.resolutions) {
      return null;
    }

    return entry.resolutions;
  }
);

/**
 * Retrieves the current product rating.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductRating = createSelector(
  getCurrentBaseProduct,
  (product) => {
    if (!product || !product.rating) {
      return null;
    }

    return product.rating;
  }
);

/**
 * Retrieves the current product manufacturer.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductManufacturer = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.manufacturer;
  }
);

/**
 * Retrieves the current product stock information.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getCurrentProductStock = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.stock;
  }
);

/**
 * Retrieves the product stock information.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductStockInfo = createSelector(
  getProductById,
  (product) => {
    if (!product || !product.productData) {
      return null;
    }
    return product.productData.stock;
  }
);

/**
 * Retrieves the current product orderable information.
 * @param {Object} state The current application state.
 * @return {boolean}
 */
export const isProductOrderable = createSelector(
  getCurrentProductStock,
  (stockInfo) => {
    if (!stockInfo) {
      return true;
    }

    return stockInfo.orderable;
  }
);

/**
 * Retrieves the product orderable information.
 * @param {Object} state The current application state.
 * @return {boolean}
 */
export const isOrderable = createSelector(
  getProductStockInfo,
  stockInfo => stockInfo && stockInfo.orderable
);

/**
 * Selects the product shipping state.
 * @param {Object} state The current application state.
 * @return {Object} The product shipping state.
 */
const getProductShippingState = state => state.product.shippingByProductId;

/**
 * Retrieves the current product shipping data.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductShipping = createSelector(
  getCurrentProductId,
  getProductShippingState,
  (productId, shipping) => {
    const entry = shipping[productId];
    if (!entry || entry.isFetching || isUndefined(entry.shipping)) {
      return null;
    }

    return entry.shipping;
  }
);

/**
 * Retrieves the current product availability.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductAvailability = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.availability;
  }
);

/**
 * Selects the product description state.
 * @param {Object} state The current application state.
 * @return {Object} The product description state.
 */
const getProductDescriptionState = state => state.product.descriptionsByProductId;

/**
 * Retrieves the current product description.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductDescription = createSelector(
  getCurrentProductId,
  getProductDescriptionState,
  (productId, descriptions) => {
    const entry = descriptions[productId];
    if (!entry || entry.isFetching || isUndefined(entry.description)) {
      return null;
    }

    return entry.description;
  }
);

/**
 * Selects the product properties state.
 * @param {Object} state The current application state.
 * @return {Object} The product properties state.
 */
export const getProductPropertiesState = state => state.product.propertiesByProductId;

/**
 * Retrieves the current product properties (unfiltered).
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductPropertiesUnfiltered = createSelector(
  getCurrentProductId,
  getProductPropertiesState,
  (productId, properties) => {
    const entry = properties[productId];
    if (!entry || entry.isFetching || isUndefined(entry.properties)) {
      return null;
    }

    return entry.properties;
  }
);

/**
 * Retrieves the current product properties (filtered).
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductProperties = createSelector(
  getProductPropertiesUnfiltered,
  (properties) => {
    if (!properties) {
      return properties;
    }

    return filterProperties(properties);
  }
);

/**
 * Retrieves the metadata for the given product.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductMetadata = createSelector(
  getProductById,
  // Skip product, if not found or return null if no metadata is set
  product => (product && product.productData.metadata) || null
);

/**
 * Indicates whether a product is a base product or not
 * @param {Object} state The current application state.
 * @param {string} productId A product id.
 * @return {boolean|null}
 */
export const isBaseProduct = createSelector(
  getProductById,
  (product) => {
    if (!product.productData || product.isFetching) {
      return null;
    }

    const { productData } = product;
    return !(
      productData.baseProductId
      || (
        productData.flags
        && productData.flags.hasVariants === false
      )
    );
  }
);
