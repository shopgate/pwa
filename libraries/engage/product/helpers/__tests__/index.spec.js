import configuration from '@shopgate/pwa-common/collections/Configuration';
import { DEFAULT_PRODUCTS_FETCH_PARAMS } from '@shopgate/pwa-common/constants/Configuration';
import { isBeta, swatchesEnabled } from '@shopgate/engage/core/helpers';
import { buildShowScheduledParams } from '../../components/EffectivityDates/helpers';
import {
  buildFetchCategoryProductsParams,
  setDefaultProductFetchParams,
} from '../index';

jest.mock('@shopgate/pwa-common/collections/Configuration', () => ({
  set: jest.fn(),
}));

jest.mock('@shopgate/engage/core/helpers', () => ({
  getFullImageSource: jest.fn(),
  loadImage: jest.fn(),
  isBeta: jest.fn(),
  swatchesEnabled: jest.fn(),
}));

jest.mock('@shopgate/engage/core/config', () => ({
  getThemeSettings: jest.fn(),
}));

jest.mock('../../components/EffectivityDates/helpers', () => ({
  buildShowScheduledParams: jest.fn(),
}));

jest.mock('@shopgate/pwa-common-commerce/product/helpers', () => ({}), { virtual: true });
jest.mock('../../components/Media/helpers', () => ({}), { virtual: true });
jest.mock('../redirects', () => ({}), { virtual: true });

describe('engage > product > helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildFetchCategoryProductsParams()', () => {
    it('returns empty params when beta is off and swatches are off', () => {
      isBeta.mockReturnValue(false);
      swatchesEnabled.mockReturnValue(false);

      expect(buildFetchCategoryProductsParams()).toEqual({ params: {} });
      // EffectivityDates is not consulted when beta is off
      expect(buildShowScheduledParams).not.toHaveBeenCalled();
    });

    it('returns characteristics only when beta is off and swatches are on', () => {
      isBeta.mockReturnValue(false);
      swatchesEnabled.mockReturnValue(true);

      expect(buildFetchCategoryProductsParams()).toEqual({
        params: { characteristics: true },
      });
      expect(buildShowScheduledParams).not.toHaveBeenCalled();
    });

    it('includes scheduled params but not characteristics when beta is on and swatches are off', () => {
      isBeta.mockReturnValue(true);
      swatchesEnabled.mockReturnValue(false);
      buildShowScheduledParams.mockReturnValue({
        params: { showScheduled: 'P1Y' },
      });

      const result = buildFetchCategoryProductsParams();

      expect(result).toEqual({ params: { showScheduled: 'P1Y' } });
      expect(result.params).not.toHaveProperty('characteristics');
    });

    it('includes both characteristics and scheduled params when beta and swatches are both on', () => {
      isBeta.mockReturnValue(true);
      swatchesEnabled.mockReturnValue(true);
      buildShowScheduledParams.mockReturnValue({
        params: { showScheduled: 'P1Y' },
      });

      expect(buildFetchCategoryProductsParams()).toEqual({
        params: {
          characteristics: true,
          showScheduled: 'P1Y',
        },
      });
    });

    it('adds cachedTime from the scheduled EffectivityDates params when present', () => {
      isBeta.mockReturnValue(true);
      swatchesEnabled.mockReturnValue(true);
      buildShowScheduledParams.mockReturnValue({
        cachedTime: 60000,
        params: { showScheduled: 'PT0S' },
      });

      expect(buildFetchCategoryProductsParams()).toEqual({
        params: {
          characteristics: true,
          showScheduled: 'PT0S',
        },
        cachedTime: 60000,
      });
    });
  });

  describe('setDefaultProductFetchParams()', () => {
    it('is a no-op when swatches are off', () => {
      swatchesEnabled.mockReturnValue(false);

      setDefaultProductFetchParams();

      expect(configuration.set).not.toHaveBeenCalled();
    });

    it('sets the characteristics default params when swatches are on', () => {
      swatchesEnabled.mockReturnValue(true);

      setDefaultProductFetchParams();

      expect(configuration.set).toHaveBeenCalledWith(DEFAULT_PRODUCTS_FETCH_PARAMS, {
        characteristics: true,
      });
    });
  });
});
