import { PipelineRequest, logger } from '@shopgate/pwa-core';
import * as pipelines from '../../constants/Pipelines';
import { shouldFetchData } from '../../helpers/redux';
import * as actions from '../../action-creators/page';
import { getPageConfigById } from '../../selectors/page';

/**
 * Retrieves the config for a page.
 * @param {string} pageId The ID of the page to request.
 * @param {boolean} [force=true] When true, the request will go out without being checked.
 * @return {Function} The dispatched action.
 */
export default function getPageConfig(pageId, force = false) {
  return (dispatch, getState) => {
    const state = getState();
    const pageConfig = getPageConfigById(state, { pageId });

    if (!force && !shouldFetchData(pageConfig)) {
      return null;
    }

    dispatch(actions.requestPageConfig(pageId));

    return new PipelineRequest(pipelines.SHOPGATE_CMS_GET_PAGE_CONFIG)
      .setInput({ pageId })
      .dispatch()
      .then(result => dispatch(actions.receivePageConfig(pageId, result)))
      .catch((error) => {
        logger.error(error);
        dispatch(actions.errorPageConfig(pageId));
      });
  };
}
