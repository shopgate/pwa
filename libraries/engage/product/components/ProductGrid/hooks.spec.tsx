import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { WidgetContext, type WidgetContextType } from '@shopgate/engage/page/components/Widgets/WidgetContext';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { useResponsiveValue } from '@shopgate/engage/styles';
import {
  getAreAppSettingsHydrated,
  getProductGridColumns,
} from '@shopgate/engage/settings/selectors/appSettings';
import type { ProductColumns } from '@shopgate/engage/settings/types/appSettings';
import { useProductGridColumns } from './hooks';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage/core/hooks', () => ({ useWidgetSettings: jest.fn() }));
jest.mock('@shopgate/engage/styles', () => ({ useResponsiveValue: jest.fn() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: jest.fn(),
  getProductGridColumns: jest.fn(),
}));

const APP_SETTINGS_DEFAULT: ProductColumns = {
  small: 2,
  large: 4,
};

// The screen-size map above, resolved to the theme breakpoints the hook feeds useResponsiveValue.
const APP_SETTINGS_DEFAULT_RESOLVED = {
  xs: 2,
  md: 4,
};

interface SetupOptions {
  hydrated: boolean;
  appColumns: ProductColumns;
  widgetSettings: { columns?: number };
}

// Configures the mocked dependencies for a single render.
const setup = ({ hydrated, appColumns, widgetSettings }: SetupOptions) => {
  (useSelector as jest.Mock).mockImplementation((selector: unknown) => {
    if (selector === getAreAppSettingsHydrated) {
      return hydrated;
    }
    if (selector === getProductGridColumns) {
      return appColumns;
    }
    return undefined;
  });
  (useWidgetSettings as jest.Mock).mockReturnValue(widgetSettings);
  // Identity mock so the test can assert which breakpoint map the hook picks.
  (useResponsiveValue as jest.Mock).mockImplementation((map: unknown) => map);
};

// Renders the hook inside an optional WidgetContext and returns the resolved map.
const renderHook = (widgetCode: string | null = null): number | undefined => {
  let result: number | undefined;

  const Consumer = () => {
    result = useProductGridColumns();
    return null;
  };

  render(
    <WidgetContext.Provider value={(widgetCode ? { code: widgetCode } : {}) as WidgetContextType}>
      <Consumer />
    </WidgetContext.Provider>
  );

  return result;
};

describe('useProductGridColumns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses the responsive app-settings default when inside a widget (pre-hydration)', () => {
    setup({
      hydrated: false,
      appColumns: APP_SETTINGS_DEFAULT,
      widgetSettings: { columns: 3 },
    });

    expect(renderHook('some-widget-code')).toEqual(APP_SETTINGS_DEFAULT_RESOLVED);
  });

  it('honors the legacy scalar flat when outside a widget (pre-hydration)', () => {
    setup({
      hydrated: false,
      appColumns: APP_SETTINGS_DEFAULT,
      widgetSettings: { columns: 5 },
    });

    expect(renderHook(null)).toEqual({ xs: 5 });
  });

  it('falls back to the app-settings default outside a widget when the legacy scalar is missing', () => {
    setup({
      hydrated: false,
      appColumns: APP_SETTINGS_DEFAULT,
      widgetSettings: {},
    });

    expect(renderHook(null)).toEqual(APP_SETTINGS_DEFAULT_RESOLVED);
  });

  it('uses the app-settings map everywhere once hydrated', () => {
    const appColumns = {
      small: 1,
      large: 3,
    };
    const resolved = {
      xs: 1,
      md: 3,
    };
    setup({
      hydrated: true,
      appColumns,
      widgetSettings: { columns: 5 },
    });

    // Both inside and outside a widget defer to the hydrated app settings.
    expect(renderHook(null)).toEqual(resolved);
    expect(renderHook('some-widget-code')).toEqual(resolved);
  });
});
