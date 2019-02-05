import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { logger } from '@shopgate/pwa-core/helpers';
import receiveProductRelations from '../action-creators/receiveProductRelations';
import requestProductRelations from '../action-creators/requestProductRelations';
import errorProductRelations from '../action-creators/errorProductRelations';
import { SHOPGATE_CATALOG_GET_PRODUCT_RELATIONS } from '../constants/Pipelines';
import { generateProductRelationsHash } from '../helpers';
import { getProductRelationsState } from '../selectors/relations';
import { PRODUCT_RELATIONS_DEFAULT_LIMIT } from '../constants/';

/**
 * Action starts product relation fetching process.
 * Returns early if product relation cache is still valid.
 * @param {Object} params Params.
 * @param {string} params.productId Product Id.
 * @param {string} params.type Type (see constants).
 * @param {number} params.limit Query limit.
 * @returns {Function}
 */
const fetchProductRelations = ({ productId, type, limit = PRODUCT_RELATIONS_DEFAULT_LIMIT }) =>
  (dispatch, getState) => {
    const pipeline = SHOPGATE_CATALOG_GET_PRODUCT_RELATIONS;
    const hash = generateProductRelationsHash({
      productId,
      type,
      limit,
    });

    const currentState = getProductRelationsState(getState())[hash];
    if (!shouldFetchData(currentState, 'productIds')) {
      return null;
    }

    dispatch(requestProductRelations({ hash }));

    const request = new PipelineRequest(pipeline)
      .setInput({
        productId,
        type,
        limit,
      })
      .dispatch();

    request
      .then((payload) => {
        const { relations } = payload;
        if (!Array.isArray(relations)) {
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

    return request;
  };

export default fetchProductRelations;
