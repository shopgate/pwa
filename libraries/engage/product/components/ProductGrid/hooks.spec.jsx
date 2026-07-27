import React from 'react';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { WidgetContext } from '@shopgate/engage/page/components/Widgets/WidgetContext';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { useResponsiveValue } from '@shopgate/engage/styles';
import {
  getAreAppSettingsHydrated,
  getProductGridColumns,
} from '@shopgate/engage/settings/selectors/appSettings';
import { useProductGridColumns } from './hooks';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage/core/hooks', () => ({ useWidgetSettings: jest.fn() }));
jest.mock('@shopgate/engage/styles', () => ({ useResponsiveValue: jest.fn() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: jest.fn(),
  getProductGridColumns: jest.fn(),
}));

const APP_SETTINGS_DEFAULT = {
  xs: 2,
  md: 4,
};

/**
 * Configures the mocked dependencies for a single render.
 * @param {Object} options The scenario options.
 * @param {boolean} options.hydrated Whether the app settings are hydrated.
 * @param {Object} options.appColumns The app-settings columns map.
 * @param {Object} options.widgetSettings The legacy widget settings.
 */
const setup = ({ hydrated, appColumns, widgetSettings }) => {
  useSelector.mockImplementation((selector) => {
    if (selector === getAreAppSettingsHydrated) {
      return hydrated;
    }
    if (selector === getProductGridColumns) {
      return appColumns;
    }
    return undefined;
  });
  useWidgetSettings.mockReturnValue(widgetSettings);
  // Identity mock so the test can assert which breakpoint map the hook picks.
  useResponsiveValue.mockImplementation(map => map);
};

/**
 * Renders the hook inside an optional WidgetContext and returns the resolved map.
 * @param {string|null} widgetCode The widget code to expose via WidgetContext.
 * @returns {Object} The breakpoint map passed to useResponsiveValue.
 */
const renderHook = (widgetCode = null) => {
  let result;

  /**
   * @returns {null} Nothing renderable.
   */
  const Consumer = () => {
    result = useProductGridColumns();
    return null;
  };

  render(
    <WidgetContext.Provider value={widgetCode ? { code: widgetCode } : {}}>
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

    expect(renderHook('some-widget-code')).toEqual(APP_SETTINGS_DEFAULT);
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

    expect(renderHook(null)).toEqual(APP_SETTINGS_DEFAULT);
  });

  it('uses the app-settings map everywhere once hydrated', () => {
    const appColumns = {
      xs: 1,
      md: 3,
    };
    setup({
      hydrated: true,
      appColumns,
      widgetSettings: { columns: 5 },
    });

    // Both inside and outside a widget defer to the hydrated app settings.
    expect(renderHook(null)).toEqual(appColumns);
    expect(renderHook('some-widget-code')).toEqual(appColumns);
  });
});
