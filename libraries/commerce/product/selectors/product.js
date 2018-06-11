import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import { isUndefined } from '@shopgate/pwa-common/helpers/validation';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import { ITEM_PATH } from '../constants';
import { getActiveFilters } from '../../filter/selectors';
import { filterProperties } from '../helpers';

/**
 * @param {Object} state The current application state.
 * @return {Object}
 */
export const getProductState = state => state.product;

/**
 * Selects all products from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of products.
 */
export const getProducts = createSelector(
  getProductState,
  state => state.productsById
);

/**
 * Retrieves the current product or variant page from the store.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {string} The id of the current product.
 */
export const getCurrentProductId = (state, props) => (props ? props.productId : null);

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
 * @return {string} The id of the current base product.
 */
export const getCurrentBaseProductId = state => state.product.currentProduct.productId;

/**
 * Retrieves the current base product data from the store.
 * @param {Object} state The current application state.
 * @returns {Object} The current product.
 */
export const getCurrentBaseProduct = createSelector(
  (state, props) => props.productId,
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
  getProducts,
  (state, props) => props.productId,
  (products, productId) => {
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
export const getProductUnitPrice = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.price.unitPrice;
  }
);

/**
 * Retrieves the price currency from a product.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getProductCurrency = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.price.currency;
  }
);

/**
 * Retrieves the generated result hash for a category ID.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {string} The result hash.
 */
const getResultHash = createSelector(
  (state, props) => props.categoryId,
  (state, props) => props.searchPhrase,
  (state, props) => props.sortOrder || DEFAULT_SORT,
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
 * @param {Object} props The component props.
 * @param {string} hash The result hash.
 * @param {Object} result The result.
 * @return {Object} The product result.
 */
export const getPopulatedProductsResult = (state, props, hash, result) => {
  const sort = props.sortOrder || DEFAULT_SORT;
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
  props => props,
  getResultHash,
  getResultByHash,
  getPopulatedProductsResult
);

/**
 * Retrieves the product name for the given id.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductData = createSelector(
  getProducts,
  (state, props) => props.productId,
  (products, productId) => {
    if (!productId || !products[productId] || !products[productId].productData) {
      return null;
    }

    return products[productId].productData;
  }
);

/**
 * Retrieves the product name for the given id.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductName = createSelector(
  getProductData,
  (productData) => {
    if (!productData) {
      return null;
    }

    return productData.name;
  }
);

/**
 * Selects the product images state.
 * @param {Object} state The current application state.
 * @return {Object} The product images state.
 */
const getProductImagesState = state => state.product.imagesByProductId;

/**
 * Retrieves the current product images or the images of the parent product.
 * If the current product does not have images, we try to select the images from the base product.
 * @param {Object} state The current application state.
 * @return {Array|null}
 */
export const getProductImages = createSelector(
  (state, props) => props.variantId,
  (state, props) => props.productId,
  getProductImagesState,
  (variantId, productId, images) => {
    let entry = images[variantId];
    const productImages = images[variantId];

    /**
     * Check if there are any images.
     * If not then default back to the base product's images.
     */
    if (!productImages || !productImages.images || !productImages.images.length) {
      entry = images[productId];
    }

    if (!entry || entry.isFetching || isUndefined(entry.images)) {
      return null;
    }

    return entry.images;
  }
);

/**
 * Retrieves the current product rating.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductRating = createSelector(
  getProductData,
  (productData) => {
    if (!productData) {
      return null;
    }

    return productData.rating;
  }
);

/**
 * Retrieves manufacturer for a given product.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductManufacturer = createSelector(
  getProductData,
  (productData) => {
    if (!productData) {
      return null;
    }

    return productData.manufacturer;
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
export const getProductStock = createSelector(
  getProductData,
  (productData) => {
    if (!productData) {
      return null;
    }

    return productData.stock;
  }
);

/**
 * Retrieves the product orderable information.
 * @param {Object} state The current application state.
 * @return {boolean}
 */
export const isOrderable = createSelector(
  getProductStock,
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
  getProductShippingState,
  (state, props) => props.productId,
  (shipping, productId) => {
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
  getProductData,
  (productData) => {
    if (!productData) {
      return null;
    }

    return productData.availability;
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
  (state, props) => props.productId,
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
const getProductPropertiesState = state => state.product.propertiesByProductId;

/**
 * Retrieves the current product properties.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getProductProperties = createSelector(
  getProductPropertiesState,
  (state, props) => props.productId,
  (properties, productId) => {
    const entry = properties[productId];
    if (!entry || entry.isFetching || isUndefined(entry.properties)) {
      return null;
    }

    return filterProperties(entry.properties);
  }
);

/**
 * Retrieves the metadata for the given product.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductMetadata = createSelector(
  getProductById,
  product => product.productData.metadata || null
);

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {boolean|null}
 */
export const isBaseProduct = createSelector(
  getProductData,
  (productData) => {
    if (!productData) {
      return null;
    }

    return productData.baseProductId === null;
  }
);

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getBaseProductId = createSelector(
  getProductData,
  (state, props) => props.productId,
  (productData, productId) => {
    if (!productData) {
      return null;
    }

    if (productData.baseProductId) {
      return productData.baseProductId;
    }

    return productId;
  }
);

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getVariantId = createSelector(
  isBaseProduct,
  (state, props) => props.productId,
  (isBase, productId) => {
    if (isBase) {
      return null;
    }

    return productId;
  }
);

/**
 * Retrieves the current product orderable information.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {boolean}
 */
export const isProductOrderable = createSelector(
  isBaseProduct,
  getProductStock,
  (isBase, stock) => {
    if (!isBase || !stock) {
      return false;
    }

    return stock.orderable;
  }
);

/**
 * Determines whether or not the product is fetching.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {boolean}
 */
export const hasProductData = createSelector(
  getProductData,
  productData => !!productData
);
