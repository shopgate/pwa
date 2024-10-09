import { createSelector } from 'reselect';
import { logger } from '@shopgate/pwa-core/helpers';
import { filterProperties } from './helpers';

/**
 * The following block of selectors was copied over from @shopgate/pwa-common-commerce/product
 * to prevent circular dependencies.
 */

/**
 * Retrieves the product state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The product state.
 */
export const getProductState = state => state.product || {};

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
 * Selects all products from the store.
 * @param {Object} state The current application state.
 * @return {Object} The collection of products.
 */
export const getProducts = createSelector(
  getProductState,
  state => state.productsById || {}
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
 * END of the copied block
 */

/**
 * Selects the is fetching state of the active product.
 */
export const getProductIsFetching = createSelector(
  getProductId,
  getProducts,
  (productId, products) => products[productId]?.isFetching || false
);

/**
 * Creates the selector to get a product's properties from the state filtered via
 * positive / negative list.
 * @returns {Function}
 */
export function makeGetProductProperties() {
  return createSelector(
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
}

/**
 * Creates the selector to get a product's properties from the state without filtering.
 * @returns {Function}
 */
export const makeGetProductPropertiesUnfiltered = () => createSelector(
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
 * Creates the selector to get a product's effectivity dates.
 * @returns {Function}
 */
export function makeGetProductEffectivityDates() {
  return createSelector(
    getProduct,
    (product) => {
      if (!product) {
        return null;
      }

      const { startDate = null, endDate = null } = product;

      return startDate || endDate
        ? {
          startDate,
          endDate,
        }
        : null;
    }
  );
}

/**
 * Creates a selector to return product characteristics.
 * @returns {Function}
 */
export function makeGetProductCharacteristics() {
  return createSelector(
    getProductDataById,
    product => ((!product || !product.characteristics) ? null : product.characteristics)
  );
}

/**
 * Creates a selector to return product featured media.
 * @returns {Function}
 */
export function makeGetProductFeaturedMedia() {
  return createSelector(
    getProduct,
    (product) => {
      if (!product) {
        return null;
      }

      return !product.featuredMedia ? null : product.featuredMedia;
    }
  );
}

/**
 * Creates a selector to indicate if a product is active.
 * @returns {Function}
 */
export const makeIsProductActive = () => createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return false;
    }

    return product?.active || false;
  }
);

/**
 * Creates a selector to indicate if the base product is active.
 * @returns {Function}
 */
export const makeIsBaseProductActive = () => createSelector(
  getBaseProduct,
  (baseProduct) => {
    if (!baseProduct) {
      return false;
    }

    return baseProduct?.active || false;
  }
);

/**
 * Creates a selector to get the property of a product based on a given label
 * @returns {Function}
 */
export const makeGetCurrentProductPropertyByLabel = () => {
  const getProductPropertiesUnfiltered = makeGetProductPropertiesUnfiltered();

  return createSelector(
    getProductPropertiesUnfiltered,
    (state, props) => props.widgetSettings,
    (currentProductProperties, widgetSettings) => {
      if (!currentProductProperties || !widgetSettings || !widgetSettings.propertyLabel) {
        return null;
      }

      return currentProductProperties
        .find(({ label }) => label === widgetSettings.propertyLabel);
    }
  );
};

/**
 * Create a selector to retrieve the product type.
 * @returns {Function}
 *
 */
export const makeGetProductType = () => createSelector(
  getProduct,
  product => product?.type
);
