import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { useResponsiveValue } from '@shopgate/engage/styles';
import {
  getAreAppSettingsHydrated,
  getProductSliderSlidesPerView,
} from '@shopgate/engage/settings/selectors/appSettings';
import type { SlidesPerView } from '@shopgate/engage/settings/types/appSettings';
import { DEFAULT_SLIDES_PER_VIEW } from './constants';
import { useSlidesPerView } from './hooks';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage/core/hooks', () => ({ useWidgetSettings: jest.fn() }));
jest.mock('@shopgate/engage/styles', () => ({ useResponsiveValue: jest.fn() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: jest.fn(),
  getProductSliderSlidesPerView: jest.fn(),
}));

const APP_SETTINGS_DEFAULT: SlidesPerView = {
  small: 2.3,
  medium: 3.3,
  large: 4.3,
};

// The screen-size map above, resolved to the theme breakpoints the hook feeds useResponsiveValue.
const APP_SETTINGS_DEFAULT_RESOLVED = {
  xs: 2.3,
  sm: 3.3,
  md: 4.3,
};

interface SetupOptions {
  hydrated: boolean;
  appSlidesPerView: SlidesPerView;
  widgetSettings: { slidesPerView?: number };
  resolved?: unknown;
}

// Configures the mocked dependencies for a single render.
const setup = ({
  hydrated, appSlidesPerView, widgetSettings, resolved,
}: SetupOptions) => {
  (useSelector as jest.Mock).mockImplementation((selector: unknown) => {
    if (selector === getAreAppSettingsHydrated) {
      return hydrated;
    }
    if (selector === getProductSliderSlidesPerView) {
      return appSlidesPerView;
    }
    return undefined;
  });
  (useWidgetSettings as jest.Mock).mockReturnValue(widgetSettings);
  // Identity mock so the test can assert which breakpoint map the hook picks.
  (useResponsiveValue as jest.Mock).mockImplementation(
    (map: unknown) => (resolved === undefined ? map : resolved)
  );
};

// Renders the hook and returns its result.
const renderHook = (): unknown => {
  let result: unknown;

  const Consumer = () => {
    result = useSlidesPerView();
    return null;
  };

  render(<Consumer />);

  return result;
};

describe('useSlidesPerView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('honors the legacy scalar flat before hydration', () => {
    setup({
      hydrated: false,
      appSlidesPerView: APP_SETTINGS_DEFAULT,
      widgetSettings: { slidesPerView: 1.5 },
    });

    expect(renderHook()).toEqual({ xs: 1.5 });
  });

  it('falls back to the app-settings default before hydration when the legacy scalar is missing', () => {
    setup({
      hydrated: false,
      appSlidesPerView: APP_SETTINGS_DEFAULT,
      widgetSettings: {},
    });

    expect(renderHook()).toEqual(APP_SETTINGS_DEFAULT_RESOLVED);
  });

  it('uses the app-settings map once hydrated', () => {
    setup({
      hydrated: true,
      appSlidesPerView: {
        small: 1.2,
        medium: 2.2,
        large: 3.2,
      },
      widgetSettings: { slidesPerView: 1.5 },
    });

    expect(renderHook()).toEqual({
      xs: 1.2,
      sm: 2.2,
      md: 3.2,
    });
  });

  it('falls back to the default when no breakpoint value resolves', () => {
    setup({
      hydrated: true,
      appSlidesPerView: APP_SETTINGS_DEFAULT,
      widgetSettings: {},
      resolved: null,
    });

    expect(renderHook()).toBe(DEFAULT_SLIDES_PER_VIEW);
  });
});
