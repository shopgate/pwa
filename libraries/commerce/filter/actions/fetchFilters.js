import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { generateResultHash, shouldFetchFilters } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CATALOG_GET_FILTERS } from '../constants/Pipelines';
import requestFilters from '../action-creators/requestFilters';
import receiveFilters from '../action-creators/receiveFilters';
import errorFilters from '../action-creators/errorFilters';
import { getFilterResults } from '../selectors';
import buildFilterParams from './helpers/buildFilterParams';
import processParams from './helpers/processParams';

/**
 * Retrieves the available filters for a list of products.
 * @returns {Function} A redux thunk
 */
function fetchFilters() {
  return (dispatch, getState) => {
    const state = getState();
    const params = buildFilterParams(state);

    const hash = generateResultHash({
      pipeline: SHOPGATE_CATALOG_GET_FILTERS,
      ...params,
    }, false, false);

    const result = getFilterResults(state)[hash];

    if (!shouldFetchFilters(result)) {
      return Promise.resolve(null);
    }

    // We need to process the params to handle edge cases in the pipeline params.
    const requestParams = processParams(params);

    if (Object.keys(requestParams).length === 0) {
      const error = `Attempt to call ${SHOPGATE_CATALOG_GET_FILTERS} pipeline without parameters - aborted`;
      logger.error(error);
      return Promise.reject(new Error(error));
    }

    dispatch(requestFilters(hash));

    return new PipelineRequest(SHOPGATE_CATALOG_GET_FILTERS)
      .setInput(requestParams)
      .dispatch()
      .then((response) => {
        dispatch(receiveFilters(hash, response.filters));
        return response;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorFilters(hash));
        return error;
      });
  };
}

export default fetchFilters;
