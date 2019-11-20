import { PipelineRequest, logger } from '@shopgate/pwa-core';
import { SHOPGATE_CMS_GET_PAGE_CONFIG } from '../../constants/Pipelines';
import {
  requestPageConfig,
  receivePageConfig,
  errorPageConfig,
} from '../../action-creators/page';
import { shouldFetchData, mutable } from '../../helpers/redux';
import { getPageConfigById } from '../../selectors/page';

/**
 * Retrieves the config for a page.
 * @param {string} pageId The ID of the page to request.
 * @return {Function} The dispatched action.
 */
function fetchPageConfig(pageId) {
  return (dispatch, getState) => {
    const state = getState();
    const pageConfig = getPageConfigById(state, { pageId });

    if (!shouldFetchData(pageConfig)) {
      return Promise.resolve(null);
    }

    dispatch(requestPageConfig(pageId));

    const request = new PipelineRequest(SHOPGATE_CMS_GET_PAGE_CONFIG)
      .setInput({ pageId })
      .dispatch();

    request
      .then((result) => {
        dispatch(receivePageConfig(pageId, result));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorPageConfig(pageId, error.code));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchPageConfig);
