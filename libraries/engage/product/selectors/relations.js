import { createSelector } from 'reselect';
import {
  getProductState,
  generateProductRelationsHash,
  getProducts,
} from '@shopgate/pwa-common-commerce/product';

const getProductRelationsState = createSelector(
  getProductState,
  product => product.productRelationsByHash
);

/**
 * Creates the selector that retrieves the product relations for the current product ID.
 * @returns {Function}
 */
function makeGetProductRelations() {
  /**
   * Retrieves the product relations for the current product ID.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @param {string} props.productId The product ID.
   * @param {string} props.type The relation type.
   * @param {number} limit The query limit.
   * @returns {Array}
   */
  return createSelector(
    getProductRelationsState,
    (_, props) => generateProductRelationsHash(props),
    (relationsState, hash) => {
      if (relationsState[hash]) {
        return relationsState[hash].productIds;
      }

      return [];
    }
  );
}

/**
 * Creates the selector that retrieves the related products for the current product ID.
 * @returns {Function}
 */
export function makeGetRelatedProducts() {
  const getProductRelations = makeGetProductRelations();

  /**
   * Retrieves the related products for the current product ID.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @param {string} props.productId The product ID.
   * @param {string} props.type The relation type.
   * @param {number} limit The query limit.
   * @returns {Array}
   */
  return createSelector(
    getProductRelations,
    getProducts,
    (relations = [], products) => relations
      .filter(id => products[id] && products[id].productData)
      .map(id => products[id].productData)
  );
}

/**
 * Creates the selector that retrieves a limited set of related products for the current product ID.
 * @returns {Function}
 */
export function makeGetMaximumRelatedProducts() {
  const getRelatedProducts = makeGetRelatedProducts();

  /**
   * Retrieves a limit set of related products for the current product ID.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @param {string} props.productId The product ID.
   * @param {string} props.type The relation type.
   * @param {number} limit The query limit.
   * @returns {Array}
   */
  return createSelector(
    getRelatedProducts,
    (_, props) => props.max || null,
    (products, max) => {
      if (!max || products.length < max) {
        return {
          products,
          productsCount: products.length,
        };
      }

      return {
        products: products.slice(0, (max)),
        productsCount: products.length,
      };
    }
  );
}
