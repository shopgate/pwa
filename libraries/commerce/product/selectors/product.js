import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import { getCurrentState } from '@shopgate/pwa-common/selectors/router';
import { logger } from '@shopgate/pwa-core/helpers';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import { getActiveFilters } from '../../filter/selectors';
import { filterProperties } from '../helpers';

/**
 * Retrieves the product state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The product state.
 */
export const getProductState = state => state.product || {};

/**
 * Selects all products from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of products.
 */
export const getProducts = createSelector(
  getProductState,
  state => state.productsById || {}
);

/**
 * Selects the product shipping state.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The product shipping state.
 */
export const getProductShippingState = createSelector(
  getProductState,
  state => state.shippingByProductId || {}
);

/**
 * Selects the product description state.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The product description state.
 */
export const getProductDescriptionState = createSelector(
  getProductState,
  state => state.descriptionsByProductId || {}
);

/**
 * Selects the product properties state.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The product properties state.
 */
export const getProductPropertiesState = createSelector(
  getProductState,
  state => state.propertiesByProductId || {}
);

/**
 * Selects the product images state.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The product images state.
 */
export const getProductImagesState = createSelector(
  getProductState,
  state => state.imagesByProductId || {}
);

/**
 * Selects the product variants state.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The product variants state.
 */
export const getProductVariantsState = createSelector(
  getProductState,
  state => state.variantsByProductId || {}
);

/**
 * Retrieves a product by id from state. Different to getProduct() which returns the product
 * entity data if available, this selector returns the pure state entry for a given productId.
 * So the expires and the isFetching property is processable.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null} The dedicated product.
 */
export const getProductById = createSelector(
  getProducts,
  (state, props) => props,
  (products, props) => {
    if (typeof props !== 'object') {
      logger.warn('Invocation of getProductById() with a productId will be deprecated soon. Please provide a props object.');
      return products[props] || null;
    }

    if (!props.productId) {
      return null;
    }

    return products[props.productId] || null;
  }
);

export const getProductDataById = createSelector(
  getProductById,
  product => (product ? product.productData : undefined)
);

/**
 * Retrieves the id of the current selected product from the component props. When the props
 * contain a variant id it will return this one instead of the product id.
 * @param {Object} state The current application state.
 * @param {Object} [props] The component props.
 * @return {string|null} The id of the current product.
 */
export const getProductId = (state, props) => {
  if (!state) {
    return null;
  }

  if (typeof props === 'undefined') {
    /**
     * Before PWA 6.0 some product selectors relied on a "currentProduct" state which doesn't exist
     * anymore. Their successors require a props object which contains a productId or a variantId.
     * To support debugging an error will be logged, if the props are missing at invocation.
     */
    logger.error('getProductId() needs to be called with a props object that includes a productId.');
    return null;
  }

  // Since a variantId can have falsy values, we need an "undefined" check here.
  if (typeof props.variantId !== 'undefined' && props.variantId !== null) {
    return props.variantId;
  }

  return props.productId || null;
};

/**
 * Gets the variant id out of the selector props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @returns {string|null}
 */
export const getVariantProductId = (state, props) => {
  if (typeof props === 'undefined') {
    /**
     * Before PWA 6.0 the variant selectors relied on a "currentProduct" state which doesn't exist
     * anymore. Their successors require a props object which contains a variantId.
     * To support debugging an error will be logged, if the props are missing at invocation.
     */
    logger.error('getVariantId() needs to be called with a props object that includes a variantId.');
  }

  const { variantId = null } = props || {};

  return variantId;
};

/**
 * Checks if currently a variant is selected within the props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @returns {boolean}
 */
export const isVariantSelected = (state, props) => !!getVariantProductId(state, props);

/**
 * Retrieves the product data for the passed productId from the store.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The current product.
 */
export const getProduct = createSelector(
  getProducts,
  getProductId,
  (products, productId) => {
    const { productData } = products[productId] || {};
    return productData || null;
  }
);

/**
 * Retrieves the product name.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getProductName = createSelector(
  getCurrentState,
  getProduct,
  (routeState, product) => {
    if (!product) {
      if (!routeState || !routeState.title) {
        return null;
      }

      return routeState.title;
    }

    return product.name;
  }
);

/**
 * Retrieves the product long name.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getProductLongName = createSelector(
  getCurrentState,
  getProduct,
  (routeState, product) => {
    if (!product) {
      if (!routeState || !routeState.title) {
        return null;
      }

      return routeState.title;
    }

    if (!product.longName) {
      return product.name;
    }

    return product.longName;
  }
);

/**
 * Retrieves the product rating.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getProductRating = createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.rating;
  }
);

/**
 * Retrieves the product manufacturer.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getProductManufacturer = createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.manufacturer;
  }
);

/**
 * Retrieves the product stock information.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getProductStock = createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.stock;
  }
);

/**
 * Retrieves the product availability.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getProductAvailability = createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.availability;
  }
);

/**
 * Retrieves the product flags.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getProductFlags = createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.flags;
  }
);

/**
 * Retrieves the product price object.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string}
 */
export const getProductPriceData = createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.price;
  }
);

/**
 * Retrieves the product currency.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @todo Move to the price selectors
 * @return {string|null}
 */
export const getProductCurrency = createSelector(
  getProductPriceData,
  (price) => {
    if (!price) {
      return null;
    }

    return price.currency;
  }
);

/**
 * Retrieves the unit price from a product.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @todo Move to the price selectors
 * @return {number|null}
 */
export const getProductUnitPrice = createSelector(
  getProductPriceData,
  (price) => {
    if (!price) {
      return null;
    }

    return price.unitPrice;
  }
);

/**
 * Determines if a product has variants.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {boolean}
 */
export const hasProductVariants = createSelector(
  getProductFlags,
  (flags) => {
    if (!flags) {
      return false;
    }

    return flags.hasVariants;
  }
);

/**
 * Determines if a product has variety (variants, options).
 * This product can not be added to a cart. Selecting of variety should be done on PDP
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {boolean}
 */
export const hasProductVariety = createSelector(
  getProductFlags,
  (flags) => {
    if (!flags) {
      return null;
    }

    return flags.hasVariants || flags.hasOptions;
  }
);

/**
 * Determines if a product is a base product.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @todo Check if returning null is correct.
 * @return {boolean|null}
 */
export const isBaseProduct = createSelector(
  getProduct,
  hasProductVariants,
  (product, hasVariants) => {
    if (!product) {
      return false;
    }

    /**
     * Base products are simple products without variants or products with related variant products.
     * At variant products the baseProductId is used to reference the base product.
     */
    return product.baseProductId === null || hasVariants;
  }
);

/**
 * Determines a baseProductId for the products which are referenced within the props.
 * When a variantId is passed, the selector will return the id of the related base product.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getBaseProductId = createSelector(
  getProduct,
  (_, props = {}) => props.productId,
  (_, props = {}) => props.variantId,
  (product, productId, variantId) => {
    if (!product) {
      // Return the productId when both ids are present, but no variant product is available yet.
      if (typeof productId !== 'undefined' && typeof variantId !== 'undefined') {
        return productId;
      }

      return null;
    }
    // First try to determine a baseProductId for a selected product
    const { baseProductId = null } = product;

    return baseProductId || product.id;
  }
);

/**
 * Retrieves the base product data for the passed productId from the store.
 * @param {Object} state The current application state.
 * @returns {Object|null} The current product.
 */
export const getBaseProduct = createSelector(
  getProducts,
  getBaseProductId,
  (products, baseProductId) => {
    if (!baseProductId) {
      return null;
    }

    const { productData = null } = products[baseProductId] || {};

    return productData;
  }
);

/**
 * Determines if a base product has variants.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {boolean}
 */
export const hasBaseProductVariants = createSelector(
  getBaseProduct,
  (baseProduct) => {
    if (!baseProduct) {
      return false;
    }

    const { flags: { hasVariants = false } = {} } = baseProduct;

    return hasVariants;
  }
);

/**
 * Retrieves the metadata for the given product.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductMetadata = createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.metadata;
  }
);

/**
 * Retrieves the metadata for the given product.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getBaseProductMetadata = createSelector(
  getBaseProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.metadata;
  }
);

/**
 * Retrieves the shipping data for the given product.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getProductShipping = createSelector(
  getProductShippingState,
  getProductId,
  (shipping, productId) => {
    const entry = shipping[productId];

    if (!entry || !entry.shipping) {
      return null;
    }

    return entry.shipping;
  }
);

export const getProductPropertiesUnfiltered = createSelector(
  getProductId,
  getProductPropertiesState,
  (productId, properties) => {
    const entry = properties[productId];
    if (!entry || entry.isFetching || typeof entry.properties === 'undefined') {
      return null;
    }

    return entry.properties;
  }
);

/**
 * Retrieves the properties for the given product.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getProductProperties = createSelector(
  getProductPropertiesState,
  getProductId,
  (properties, productId) => {
    const entry = properties[productId];

    if (!entry || !entry.properties) {
      return null;
    }

    return filterProperties(entry.properties);
  }
);

/**
 * Retrieves the description for the given product.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getProductDescription = createSelector(
  getProductDescriptionState,
  getProductId,
  (descriptions, productId) => {
    const entry = descriptions[productId];

    if (!entry || typeof entry.description === 'undefined') {
      return null;
    }

    return entry.description;
  }
);

/**
 * Retrieves the images for the given product. If the props contain a variantId, and the related
 * product does not have images, the selector tries to pick images from it's base product.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Array|null}
 */
export const getProductImages = createSelector(
  getProductImagesState,
  getProductId,
  getBaseProductId,
  (images, productId, baseProductId) => {
    const { images: productImages } = images[productId] || {};
    const { images: baseProductImages } = (baseProductId !== null && images[baseProductId]) || {};

    // If the product doesn't have images...
    if (!Array.isArray(productImages) || !productImages.length) {
      // ...check the base product.
      if (!Array.isArray(baseProductImages) || !baseProductImages.length) {
        return null;
      }

      return baseProductImages;
    }

    return productImages;
  }
);

/**
 * Retrieves the product variant data.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getProductVariants = createSelector(
  getProductVariantsState,
  getBaseProductId,
  (variants, baseProductId) => {
    const entry = variants[baseProductId];

    if (!entry || !entry.variants) {
      return null;
    }

    return entry.variants;
  }
);

/**
 * Retrieves a product for the selected variant id from the store.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @returns {Object|null} The selected variant or null if none is selected
 */
export const getSelectedVariant = createSelector(
  getProduct,
  isVariantSelected,
  (product, selected) => {
    if (!product || !selected) {
      return null;
    }

    return product;
  }
);

/**
 * Determines if a product is orderable.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {boolean}
 */
export const isProductOrderable = createSelector(
  getProductStock,
  stockInfo => !!(stockInfo && stockInfo.orderable)
);

/**
 * Retrieves the product id of a variant product. When no variantId is passed within
 * the props, the selector will return NULL.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getVariantId = createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return null;
    }

    const { id, baseProductId } = product;

    return baseProductId !== null ? id : null;
  }
);

/**
 * Retrieves an availability object for a passed set of variant characteristics.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getVariantAvailabilityByCharacteristics = createSelector(
  getProductVariants,
  (state, props = {}) => props.characteristics,
  (variants, characteristics) => {
    if (!variants) {
      return null;
    }

    const found = variants.products.find(product =>
      isEqual(product.characteristics, characteristics));

    if (!found) {
      return null;
    }

    return found.availability;
  }
);

/**
 * Retrieves the generated result hash for a category id or search phrase.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @returns {string|null} The result hash.
 */
export const getResultHash = createSelector(
  (state, props = {}) => props.categoryId,
  (state, props = {}) => props.searchPhrase,
  (state, props = {}) => props.params,
  (state, props) => getSortOrder(state, props) || DEFAULT_SORT,
  getActiveFilters,
  (categoryId, searchPhrase, params, sort, filters) => {
    if (categoryId) {
      return generateResultHash({
        categoryId,
        sort,
        ...(filters && { filters }),
        ...params,
      });
    }

    if (searchPhrase) {
      return generateResultHash({
        searchPhrase,
        sort,
        ...params,
        ...(filters && { filters }),
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
export const getResultByHash = createSelector(
  getProductState,
  getResultHash,
  (productState, hash) => {
    const results = productState.resultsByHash[hash];

    if (!results) {
      return null;
    }

    return results;
  }
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
  const sort = getSortOrder(state, props) || DEFAULT_SORT;
  let products = [];
  let totalProductCount = !hash ? 0 : null;

  if (result && result.products) {
    totalProductCount = result.totalResultCount;
    products = result.products.map(productId => getProductById(state, { productId }).productData);
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
  (state, props) => props,
  getResultHash,
  getResultByHash,
  getPopulatedProductsResult
);

/**
 * Selector mappings for PWA < 6.0
 * @deprecated
 */
export const getCurrentProduct = getProduct;
export const getCurrentProductId = getProductId;
export const getCurrentBaseProductId = getBaseProductId;
export const getCurrentBaseProduct = getBaseProduct;
export const getCurrentProductStock = getProductStock;
export const getProductStockInfo = getProductStock;
export const getProductBasePrice = getProductUnitPrice;
export const isOrderable = isProductOrderable;
