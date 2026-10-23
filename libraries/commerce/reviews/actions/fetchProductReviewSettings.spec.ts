import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import {
  REQUEST_PRODUCT_REVIEW_SETTINGS,
  RECEIVE_PRODUCT_REVIEW_SETTINGS,
  ERROR_PRODUCT_REVIEW_SETTINGS,
} from '../constants';
import type { ReviewSettingsState } from '../types/reviewSettings';
import fetchProductReviewSettings from './fetchProductReviewSettings';

/* eslint-disable @typescript-eslint/no-explicit-any */
let mockedResolver: (mockInstance: any, resolve: any, reject: any) => void;

jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => mockedPipelineRequestFactory((mockInstance: any, resolve: any, reject: any) => {
    mockedResolver(mockInstance, resolve, reject);
  })
);
/* eslint-enable @typescript-eslint/no-explicit-any */

describe('Reviews actions: fetchProductReviewSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch request then receive on success', async () => {
    const settings = {
      features: [],
      paginationType: 'offset',
      customFields: [],
    };
    mockedResolver = (mockInstance, resolve) => resolve(settings);

    const dispatch = jest.fn();
    const getState = (): ReviewSettingsState => ({ reviews: { reviewSettings: {} } });

    await fetchProductReviewSettings()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_PRODUCT_REVIEW_SETTINGS });
    expect(dispatch).toHaveBeenCalledWith({ type: RECEIVE_PRODUCT_REVIEW_SETTINGS, settings });
  });

  it('should dispatch request then error on failure', async () => {
    const error = new Error('failed');
    mockedResolver = (mockInstance, resolve, reject) => reject(error);

    const dispatch = jest.fn();
    const getState = (): ReviewSettingsState => ({ reviews: { reviewSettings: {} } });

    await fetchProductReviewSettings()(dispatch, getState).catch(() => undefined);
    await Promise.resolve();

    expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_PRODUCT_REVIEW_SETTINGS });
    expect(dispatch).toHaveBeenCalledWith({ type: ERROR_PRODUCT_REVIEW_SETTINGS, error });
  });

  it('should skip the request when cached settings are still valid', async () => {
    const cached = {
      features: [],
      paginationType: 'offset' as const,
      customFields: [],
      isFetching: false,
      expires: Date.now() + 100000,
    };
    const dispatch = jest.fn();
    const getState = (): ReviewSettingsState => ({ reviews: { reviewSettings: cached } });

    const result = await fetchProductReviewSettings()(dispatch, getState);

    expect(dispatch).not.toHaveBeenCalled();
    expect(result).toEqual(cached);
  });
});
