import { PipelineRequest } from '@shopgate/pwa-core';
import { getDeviceTypeForCms } from '@shopgate/engage/core';
import { makeGetPage, getIsCms2Enabled } from '@shopgate/engage/page/selectors';
import {
  requestPageConfigV2,
  receivePageConfigV2,
  errorPageConfigV2,
} from '@shopgate/engage/page/action-creators';
import { hasNewServices } from '@shopgate/engage/core/helpers';
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
    const cmsV2Enabled = getIsCms2Enabled(state);

    let pageConfig;

    if (cmsV2Enabled) {
      pageConfig = makeGetPage({ slug: pageId })(state);
    } else {
      pageConfig = getPageConfigById(state, { pageId });
    }

    if (!shouldFetchData(pageConfig)) {
      return Promise.resolve(null);
    }

    const deviceTypeOfCmsPage = getDeviceTypeForCms();

    if (cmsV2Enabled) {
      dispatch(requestPageConfigV2({ slug: pageId }));
    } else {
      dispatch(requestPageConfig(pageId));
    }

    const request = new PipelineRequest(SHOPGATE_CMS_GET_PAGE_CONFIG)
      .setVersion(cmsV2Enabled ? 2 : 1)
      .setInput({
        pageId,
        ...(hasNewServices() && !cmsV2Enabled ? {
          deviceType: deviceTypeOfCmsPage,
        } : null),
      })
      .dispatch();

    request
      .then((result) => {
        if (cmsV2Enabled) {
          dispatch(receivePageConfigV2({
            slug: pageId,
            data: result.page,
          }));
        } else {
          dispatch(receivePageConfig(pageId, result));
        }
      })
      .catch((error) => {
        if (cmsV2Enabled) {
          dispatch(errorPageConfigV2({
            slug: pageId,
            code: error.code,
          }));
        } else {
          dispatch(errorPageConfig(pageId, error.code));
        }
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchPageConfig);
