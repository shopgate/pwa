import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  generateResultHash,
  shouldFetchFilters,
} from '@shopgate/pwa-common/helpers/redux';
import requestFilters from '../action-creators/requestFilters';
import receiveFilters from '../action-creators/receiveFilters';
import errorFilters from '../action-creators/errorFilters';
import {
  getAvailableFiltersStack,
  getActiveFilters,
} from '../selectors';
import buildFilterParams from './helpers/buildFilterParams';
import processParams from './helpers/processParams';

/**
 * Retrieves the available filters for a list of products.
 * @returns {Function} A redux thunk
 */
const getFilters = () => (dispatch, getState) => {
  const state = getState();
  const activeFilters = getActiveFilters(state);
  const params = buildFilterParams(state);

  const hash = generateResultHash({
    pipeline: 'getFilters',
    ...params,
  }, false);

  const result = getAvailableFiltersStack(state)[hash];

  if (!shouldFetchFilters(result)) {
    return;
  }

  // We need to process the params to handle edge cases in the pipeline params.
  const requestParams = processParams(params, activeFilters);

  if (Object.keys(requestParams).length === 0) {
    logger.error('Attempt to call getFilters pipeline without parameters - aborted');
    return;
  }

  dispatch(requestFilters(hash));
  new PipelineRequest('shopgate.catalog.getFilters')
    .setInput(requestParams)
    .dispatch()
    .then(({ filters }) => dispatch(receiveFilters(hash, filters)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorFilters(hash));
    });
};

export default getFilters;
