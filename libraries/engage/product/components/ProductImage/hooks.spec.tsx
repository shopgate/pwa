import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useWidgetSettings } from '@shopgate/engage/core/hooks/useWidgetSettings';
import {
  getAreAppSettingsHydrated,
  getImageSettings,
} from '@shopgate/engage/settings/selectors/appSettings';
import { DEFAULT_APP_SETTINGS } from '@shopgate/engage/settings/reducers/appSettings';
import { DEFAULT_SHOW_INNER_SHADOW } from '@shopgate/engage/settings/constants/imageSettings';
import { useProductImageShadow } from './hooks';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage/core/hooks/useWidgetSettings', () => ({
  useWidgetSettings: jest.fn(),
}));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: jest.fn(),
  getImageSettings: jest.fn(),
}));

interface SetupOptions {
  hydrated: boolean;
  storeValue?: boolean;
  widgetSettings?: { showInnerShadow?: boolean } | null;
}

// Configures the mocked dependencies for a single render.
const setup = ({ hydrated, storeValue = true, widgetSettings = null }: SetupOptions) => {
  (useSelector as jest.Mock).mockImplementation((selector: unknown) => {
    if (selector === getAreAppSettingsHydrated) {
      return hydrated;
    }
    if (selector === getImageSettings) {
      return {
        ...DEFAULT_APP_SETTINGS.images,
        product: {
          ...DEFAULT_APP_SETTINGS.images.product,
          showInnerShadow: storeValue,
        },
      };
    }
    return undefined;
  });
  (useWidgetSettings as jest.Mock).mockReturnValue(widgetSettings);
};

// Renders the hook and returns its result.
const renderHook = (widgetId?: string): boolean | undefined => {
  let result: boolean | undefined;

  const Consumer = () => {
    result = useProductImageShadow(widgetId);
    return null;
  };

  render(<Consumer />);

  return result;
};

describe('useProductImageShadow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses the app settings once hydrated, ignoring the widget configuration', () => {
    setup({
      hydrated: true,
      storeValue: true,
      widgetSettings: { showInnerShadow: false },
    });

    expect(renderHook()).toBe(true);
  });

  it('honors the widget configuration before hydration', () => {
    setup({
      hydrated: false,
      storeValue: true,
      widgetSettings: { showInnerShadow: false },
    });

    expect(renderHook()).toBe(false);
  });

  it.each([
    ['the widget configuration has no value', {}],
    ['there is no widget configuration at all', null],
  ])('falls back to the built-in default when %s', (_, widgetSettings) => {
    setup({
      hydrated: false,
      widgetSettings,
    });

    expect(renderHook()).toBe(DEFAULT_SHOW_INNER_SHADOW);
  });

  // A source can null the branch out, and every ProductImage calls this hook.
  it.each([
    ['the product settings are nulled out', { product: null }],
    ['the image settings are nulled out', null],
  ])('falls back to the built-in default when %s', (_, images) => {
    (useSelector as jest.Mock).mockImplementation((selector: unknown) => {
      if (selector === getAreAppSettingsHydrated) {
        return true;
      }
      if (selector === getImageSettings) {
        return images === null ? null : { ...DEFAULT_APP_SETTINGS.images, ...images };
      }
      return undefined;
    });
    (useWidgetSettings as jest.Mock).mockReturnValue(null);

    expect(renderHook()).toBe(DEFAULT_SHOW_INNER_SHADOW);
  });

  // MediaImage carries its own legacy widget id, but resolves against the same app setting.
  it('reads the legacy value from the given widget id', () => {
    setup({
      hydrated: false,
      widgetSettings: { showInnerShadow: false },
    });

    renderHook('@shopgate/engage/product/MediaImage');

    expect(useWidgetSettings).toHaveBeenCalledWith('@shopgate/engage/product/MediaImage');
  });

  it('treats an explicit false in the widget configuration as a value, not as absent', () => {
    setup({
      hydrated: false,
      widgetSettings: { showInnerShadow: false },
    });

    expect(renderHook()).toBe(false);
  });
});
