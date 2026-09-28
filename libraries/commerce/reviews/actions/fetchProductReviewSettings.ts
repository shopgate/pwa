import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import type { Dispatch } from 'redux';
import {
  requestProductReviewSettings,
  receiveProductReviewSettings,
  errorProductReviewSettings,
} from '../action-creators/reviewSettings';
import { getReviewSettingsState } from '../selectors/reviewSettings';
import { SHOPGATE_CATALOG_GET_PRODUCT_REVIEW_SETTINGS } from '../constants/Pipelines';
import type { ReviewSettings, ReviewSettingsState } from '../types/reviewSettings';

/**
 * Loads the product review settings and caches them in the reviews slice.
 * Skips the request while a valid cached response exists or one is in flight.
 * @returns A redux thunk resolving with the pipeline response or the cached settings.
 */
const fetchProductReviewSettings = () => (
  dispatch: Dispatch,
  getState: () => ReviewSettingsState
) => {
  const settings = getReviewSettingsState(getState());

  if (!shouldFetchData(settings)) {
    return Promise.resolve(settings);
  }

  dispatch(requestProductReviewSettings());

  const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_REVIEW_SETTINGS).dispatch();

  request
    .then((result: ReviewSettings) => {
      dispatch(receiveProductReviewSettings(result));
    })
    .catch((error) => {
      dispatch(errorProductReviewSettings(error));
    });

  return request;
};

export default fetchProductReviewSettings;
