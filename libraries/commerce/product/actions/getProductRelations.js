import isArray from 'lodash/isArray';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  receiveProductRelations,
  requestProductRelations,
  errorProductRelations,
} from '../action-creators/productRelations';
import { SHOPGATE_CATALOG_GET_PRODUCT_RELATIONS } from '../constants/Pipelines';
import { generateProductRelationsHash } from '../helpers';

/**
 * Action starts product relation fetching process.
 * Returns early if product relation cache is still valid.
 * @param {Object} params Params.
 * @param {string} params.productId Product Id.
 * @param {string} params.type Type (see constants).
 * @param {number} params.limit Query limit.
 * @returns {Function}
 */
const getProductRelations = ({ productId, type, limit }) =>
  (dispatch, getState) => {
    const pipeline = SHOPGATE_CATALOG_GET_PRODUCT_RELATIONS;
    const hash = generateProductRelationsHash({
      productId,
      type,
      limit,
    });
    const currentState = getState().product.productRelations[hash];

    if (!shouldFetchData(currentState, 'productIds')) {
      return null;
    }

    dispatch(requestProductRelations({ hash }));

    return new PipelineRequest(pipeline)
      .setInput({
        productId,
        type,
        limit,
      })
      .dispatch()
      .then((payload) => {
        const { relations } = payload;
        if (!isArray(relations)) {
          logger.error(new Error(`Invalid ${pipeline} pipeline response`), payload);
          dispatch(errorProductRelations({ hash }));
          return;
        }

        dispatch(receiveProductRelations({
          hash,
          payload,
        }));
      })
      .catch((err) => {
        logger.error(err);
        dispatch(errorProductRelations({ hash }));
      });
  };

export default getProductRelations;
