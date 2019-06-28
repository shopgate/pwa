import { createSelector } from 'reselect';
import {
  getProductId,
  getProductState,
} from '../selectors/product';

/**
 * Retrieves the product media state.
 * @param {Object} state The application state.
 * @returns {Object} The product options state.
 */
const getProductMediaState = createSelector(
  getProductState,
  state => state.mediaByProductId
);

/**
 * Retrieves the current products media.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object[]|null} The product media collection.
 */
export const getProductMedia = createSelector(
  getProductId,
  (state, props) => props.types,
  getProductMediaState,
  (productId, types, productMediaState) => {
    const productMedia = productMediaState[productId];
    if (!productMedia || productMedia.isFetching) {
      return null;
    }
    if (!types || !productMedia.media) {
      return productMedia.media;
    }
    return productMedia.media.filter(media => types.includes(media.type));
  }
);
