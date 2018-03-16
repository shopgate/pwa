import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '../../helpers/redux';
import {
  receivePageConfig,
  requestPageConfig,
  errorPageConfig,
} from '../../action-creators/page';

/**
 * Retrieves the config for a page.
 * @param {string} pageId The ID of the page to request.
 * @return {Function} The dispatched action.
 */
const getPageConfig = pageId => (dispatch, getState) => {
  const state = getState();

  if (shouldFetchData(state.page[pageId])) {
    dispatch(requestPageConfig(pageId));

    return new PipelineRequest('shopgate.cms.getPageConfig')
      .setInput({ pageId })
      .dispatch()
      .then(result => dispatch(receivePageConfig(pageId, result)))
      .catch((error) => {
        logger.error(error);
        dispatch(errorPageConfig(pageId));
      });
  }

  return null;
};

export default getPageConfig;
