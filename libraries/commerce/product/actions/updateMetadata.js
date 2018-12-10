import { logger } from '@shopgate/pwa-core';
import { UPDATE_METADATA } from '../constants';

/**
 * Changes the metadata of an existing product in the store.
 * @param {string} productId The product ID to change the metadata for.
 * @param {Oject} [metadata=null] The metadata to update.
 * @returns {Function} A redux thunk.
 */
const updateMetaData = (productId, metadata = null) => (dispatch) => {
  if (!metadata) {
    logger.warn('updateMetaData was called without new metadata!');
    return;
  }

  dispatch({
    type: UPDATE_METADATA,
    productId,
    metadata,
  });
};

export default updateMetaData;
