import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
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
 * Retrieves a product by ID from state.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null} The dedicated product.
 */
export const getProductById = createSelector(
  getProducts,
  (state, props) => props,
  (products, props) => {
    if (typeof props !== 'object') {
      logger.warn('Invocation of getProductById() with a productId will be deprecated soon. Use a props object instead.');
      return products[props] || null;
    }

    if (!props.productId) {
      return null;
    }

    return products[props.productId] || null;
  }
);

/**
 * Retrieves the id of the current selected product from the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null} The id of the current product.
 */
export const getCurrentProductId = (state, props) => {
  if (!props) {
    return null;
  }

  // Since a variantId can have falsy values, we need an "undefined" check here.
  if (typeof props.variantId !== 'undefined') {
    return props.variantId;
  }

  return props.productId || null;
};

/**
 * Retrieves the current product data from the store.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The current product.
 */
export const getCurrentProduct = createSelector(
  getProducts,
  getCurrentProductId,
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
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.name;
  }
);

/**
 * Retrieves the product rating.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getProductRating = createSelector(
  getCurrentProduct,
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
  getCurrentProduct,
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
  getCurrentProduct,
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
  getCurrentProduct,
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
  getCurrentProduct,
  (product) => {
    if (!product) {
      return null;
    }

    return product.flags;
  }
);

/**
 * Retrieves the metadata for the given product.
 * @param {Object} state The current application state.
 * @return {Object|null}
 */
export const getProductMetadata = createSelector(
  getProductById,
  (product) => {
    if (!product) {
      return null;
    }

    return product.productData.metadata;
  }
);

/**
 * Retrieves the product price object.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string}
 */
export const getProductPrice = createSelector(
  getCurrentProduct,
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
  getProductPrice,
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
  getProductPrice,
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
export const hasVariants = createSelector(
  getProductFlags,
  (flags) => {
    if (!flags) {
      return false;
    }

    return flags.hasVariants;
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
  getCurrentProduct,
  hasVariants,
  (product, productHasVariants) => {
    if (!product) {
      return false;
    }

    /**
     * Perform the actual check. Base products are products which have related variant products.
     * At those variant products the baseProductId is used to reference the base product.
     */
    return !(product.baseProductId !== null || productHasVariants === false);
  }
);

/**
 * Determines a baseProductId for the products which are referenced within the props.
 * When a variantId is passed, the selector will return the id of the related base product.
 * When only a productId is passed, the selector will return it's id as far as the product has
 * variants. Otherwise it will return NULL.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getBaseProductId = createSelector(
  getCurrentProduct,
  isBaseProduct,
  (product, productIsBaseProduct) => {
    if (!product) {
      return null;
    }

    if (product.baseProductId !== null) {
      return product.baseProductId;
    }

    if (productIsBaseProduct) {
      return product.id;
    }

    return null;
  }
);

/**
 * Retrieves the current base product data from the store.
 * @param {Object} state The current application state.
 * @returns {Object|null} The current product.
 */
export const getCurrentBaseProduct = createSelector(
  getProducts,
  getBaseProductId,
  (products, baseProductId) => {
    if (!baseProductId) {
      return null;
    }

    const { productData = null } = products[baseProductId];

    return productData;
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
  getCurrentProductId,
  (shipping, productId) => {
    const entry = shipping[productId];

    if (!entry || !entry.shipping) {
      return null;
    }

    return entry.shipping;
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
  getCurrentProductId,
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
  getCurrentProductId,
  (descriptions, productId) => {
    const entry = descriptions[productId];

    if (!entry || !entry.description) {
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
  getCurrentProductId,
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
 * Determines if a product is orderable.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {boolean}
 */
export const isOrderable = createSelector(
  getProductStock,
  stockInfo => !!(stockInfo && stockInfo.orderable)
);

/**
 * Determines whether or not the product is fetching.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {boolean}
 */
export const isFetching = createSelector(
  getProducts,
  getCurrentProductId,
  (products, productId) => {
    const { isFetching: fetching } = products[productId] || {};
    return !!fetching;
  }
);

/**
 * Retrieves the product id of a variant product. When no variantId is passed within
 * the props, the selector will return NULL.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {string|null}
 */
export const getVariantId = createSelector(
  getCurrentProduct,
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

    const found = variants.products.find(product => (
      isEqual(product.characteristics, characteristics)
    ));

    if (!found) {
      return null;
    }

    return found.availability;
  }
);

/**
 * Retrieves the current product orderable information.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @todo Check if this selector can be combined with isOrderable().
 * @return {boolean}
 */
export const isProductOrderable = createSelector(
  isBaseProduct,
  isOrderable,
  (base, orderable) => {
    if (!orderable || base) {
      return false;
    }

    return orderable;
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
  state => getSortOrder(state) || DEFAULT_SORT,
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
export const getResultByHash = createSelector(
  state => state.product,
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
  const sort = getSortOrder(state) || DEFAULT_SORT;
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
 * @todo Is this selector really needed?
 */
export const hasProductData = isFetching;

/**
 * Mappings for PWA < 6.0
 * @deprecated
 */

export const getCurrentBaseProductId = getBaseProductId;
export const getCurrentProductStock = getProductStock;
export const getProductStockInfo = getProductStock;
export const getProductBasePrice = getProductUnitPrice;
