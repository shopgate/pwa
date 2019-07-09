import { createSelector } from 'reselect';
import { generateProductRelationsHash } from '../helpers';
import { getProducts } from './product';

/**
 * Returns productRelations state.
 * @param {Object} state State.
 * @returns {Object}
 * @deprecated
 */
export const getProductRelationsState = state => state.product.productRelationsByHash;

/**
 * Factory of a function that returns selector of product relations state for given hash.
 * @param {string} hash State hash.
 * @returns {Function}
 * @deprecated
 */
export const getProductRelationsByHash = hash => createSelector(
  getProductRelationsState,
  (state) => {
    if (state[hash]) {
      return state[hash].productIds;
    }

    return undefined;
  }
);

/**
 * Selector factory.
 * Accepts parameters as arguments. When used within `mapStateToProps` factory won't be called
 * as long as `state` and `props` didn't change (shallow comparison).
 * @param {Object} params Params
 * @param {string} params.productId Product id.
 * @param {string} type Relation type (see constants)
 * @param {number} limit Query limit.
 * @returns {Function} Selector.
 * @deprecated Use `makeGetProductRelations` from `@shopgate/engage/products` instead.
 */
export const getProductRelations = ({ productId, type, limit }) => (state) => {
  const hash = generateProductRelationsHash({
    productId,
    type,
    limit,
  });

  return getProductRelationsByHash(hash)(state);
};

/**
 * Returns products data for product id.
 *
 * @param {Object} params Params, see `.getProductRelations`
 * @returns {Array}
 * @deprecated Use `makeGetRelatedProducts` from `@shopgate/engage/products` instead.
 */
export const getRelatedProducts = params => createSelector(
  getProductRelations(params),
  getProducts,
  (relations = [], productsById) => relations
    .filter(id => productsById[id] && productsById[id].productData)
    .map(id => productsById[id].productData)
);
