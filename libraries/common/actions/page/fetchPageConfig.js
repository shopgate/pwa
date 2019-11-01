import { PipelineRequest, logger } from '@shopgate/pwa-core';
import * as pipelines from '../../constants/Pipelines';
import * as actions from '../../action-creators/page';
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
      return null;
    }

    dispatch(actions.requestPageConfig(pageId));

    return new PipelineRequest(pipelines.SHOPGATE_CMS_GET_PAGE_CONFIG)
      .setInput({ pageId })
      .dispatch()
      .then(result => dispatch(actions.receivePageConfig(pageId, result)))
      .catch((error) => {
        logger.error(error);
        dispatch(actions.errorPageConfig(pageId, error.code));
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchPageConfig);
