import { createSelector } from 'reselect';
import {
  getProductId,
  getProductState,
} from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Creates a selector that retrieves the product media state.
 * @returns {Function}
 */
export const makeGetProductMediaState = () =>
  /**
   * Retrieves the product media state.
   * @param {Object} state The application state.
   * @returns {Object} The product options state.
   */
  createSelector(
    getProductState,
    state => state.mediaByProductId
  );

/**
 * Creates a selector that retrieves product media for a passed product id.
 * @returns {Function}
 */
export const makeGetProductMedia = () => {
  const getProductMediaState = makeGetProductMediaState();

  /**
   * Retrieves the current products media.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object[]|null} The product media collection.
   */
  return createSelector(
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
};

