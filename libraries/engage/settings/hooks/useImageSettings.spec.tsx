import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import {
  getAreAppSettingsHydrated,
  getImageSettings,
} from '../selectors/appSettings';
import { DEFAULT_APP_SETTINGS } from '../reducers/appSettings';
import type { ImageSettings } from '../types/appSettings';
import { useImageServiceSettings, useProductImageSettings } from './useImageSettings';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('../selectors/appSettings', () => ({
  getAreAppSettingsHydrated: jest.fn(),
  getImageSettings: jest.fn(),
}));
jest.mock('@shopgate/engage/core/config/getThemeSettings', () => ({
  getThemeSettings: jest.fn(() => undefined),
}));

interface SetupOptions {
  hydrated: boolean;
  imageSettings?: ImageSettings;
}

// Configures the mocked selectors for a single render.
const setup = ({ hydrated, imageSettings = DEFAULT_APP_SETTINGS.images }: SetupOptions) => {
  (useSelector as jest.Mock).mockImplementation((selector: unknown) => {
    if (selector === getAreAppSettingsHydrated) {
      return hydrated;
    }
    if (selector === getImageSettings) {
      return imageSettings;
    }
    return undefined;
  });
};

// Renders a hook and returns both its result and how often the component rendered.
const renderHook = <T, >(hook: () => T) => {
  const results: T[] = [];

  const Consumer = () => {
    results.push(hook());
    return null;
  };

  const { rerender } = render(<Consumer />);

  return {
    results,
    get result() {
      return results[results.length - 1];
    },
    rerender: () => rerender(<Consumer />),
  };
};

describe('settings / hooks / useImageSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useProductImageSettings', () => {
    it('resolves every context', () => {
      setup({ hydrated: true });

      // Sorted, because the key order only reflects how PRODUCT_IMAGE_BASE_WIDTHS happens to be
      // written - it carries no meaning.
      expect(Object.keys(renderHook(useProductImageSettings).result).sort())
        .toEqual(['gallery', 'list', 'pdp']);
    });

    it('applies the configured ratio once hydrated', () => {
      setup({
        hydrated: true,
        imageSettings: {
          ...DEFAULT_APP_SETTINGS.images,
          product: { ...DEFAULT_APP_SETTINGS.images.product, ratio: { width: 4, height: 5 } },
        },
      });

      const { result } = renderHook(useProductImageSettings);

      expect(result.list.resolutions).toEqual([{ width: 440, height: 550 }]);
      expect(result.list.ratio).toEqual([4, 5]);
    });

    it('falls back to the legacy behavior before hydration', () => {
      setup({
        hydrated: false,
        imageSettings: {
          ...DEFAULT_APP_SETTINGS.images,
          product: { ...DEFAULT_APP_SETTINGS.images.product, ratio: { width: 4, height: 5 } },
        },
      });

      const { result } = renderHook(useProductImageSettings);

      expect(result.list.resolutions).toEqual([{ width: 440, height: 440 }]);
      expect(result.list.ratio).toBeNull();
    });
  });

  describe('useImageServiceSettings', () => {
    it('returns the wire ready quality and fill color', () => {
      setup({ hydrated: true });

      expect(renderHook(useImageServiceSettings).result).toEqual({
        quality: 75,
        fillColor: 'FFFFFF',
        fillTransparent: true,
      });
    });

    it('stays reference stable across renders, so it does not defeat memoization', () => {
      setup({ hydrated: true });

      const { results, rerender } = renderHook(useImageServiceSettings);
      rerender();

      expect(results).toHaveLength(2);
      expect(results[0]).toBe(results[1]);
    });
  });
});
