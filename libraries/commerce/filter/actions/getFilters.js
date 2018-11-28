import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  generateResultHash,
  shouldFetchFilters,
} from '@shopgate/pwa-common/helpers/redux';
import * as pipelines from '../constants/Pipelines';
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
const getFilters = () => (dispatch, getState) => {
  const state = getState();
  const params = buildFilterParams();

  const hash = generateResultHash({
    pipeline: pipelines.SHOPGATE_CATALOG_GET_FILTERS,
    ...params,
  }, false, false);

  const result = getFilterResults(state)[hash];

  if (!shouldFetchFilters(result)) {
    return;
  }

  // We need to process the params to handle edge cases in the pipeline params.
  const requestParams = processParams(params);

  if (Object.keys(requestParams).length === 0) {
    logger.error(`Attempt to call ${pipelines.SHOPGATE_CATALOG_GET_FILTERS} pipeline without parameters - aborted`);
    return;
  }

  dispatch(requestFilters(hash));
  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_FILTERS)
    .setInput(requestParams)
    .dispatch()
    .then(({ filters }) => dispatch(receiveFilters(hash, filters)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorFilters(hash));
    });
};

export default getFilters;
