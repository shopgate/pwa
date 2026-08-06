import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import {
  getAreAppSettingsHydrated,
  getShowFavoritesCounter,
} from '@shopgate/engage/settings/selectors/appSettings';
import { useShowFavoritesCounter } from './hooks';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage/core/hooks', () => ({ useWidgetSettings: jest.fn() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: jest.fn(),
  getShowFavoritesCounter: jest.fn(),
}));

interface SetupOptions {
  hydrated: boolean;
  appSettingsValue: boolean;
  widgetSettings: { showCounter?: boolean };
}

const setup = ({ hydrated, appSettingsValue, widgetSettings }: SetupOptions) => {
  (useSelector as jest.Mock).mockImplementation((selector: unknown) => {
    if (selector === getAreAppSettingsHydrated) {
      return hydrated;
    }
    if (selector === getShowFavoritesCounter) {
      return appSettingsValue;
    }
    return undefined;
  });
  (useWidgetSettings as jest.Mock).mockReturnValue(widgetSettings);
};

const renderHook = (): boolean | undefined => {
  let result: boolean | undefined;

  const Consumer = () => {
    result = useShowFavoritesCounter();
    return null;
  };

  render(<Consumer />);

  return result;
};

describe('useShowFavoritesCounter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('honors the legacy widget setting before hydration', () => {
    setup({
      hydrated: false,
      appSettingsValue: true,
      widgetSettings: { showCounter: false },
    });
    expect(renderHook()).toBe(false);
  });

  it('keeps the legacy default of true when the widget setting is missing', () => {
    setup({
      hydrated: false,
      appSettingsValue: false,
      widgetSettings: {},
    });
    expect(renderHook()).toBe(true);
  });

  it('uses the app settings once hydrated', () => {
    setup({
      hydrated: true,
      appSettingsValue: false,
      widgetSettings: { showCounter: true },
    });
    expect(renderHook()).toBe(false);

    setup({
      hydrated: true,
      appSettingsValue: true,
      widgetSettings: { showCounter: false },
    });
    expect(renderHook()).toBe(true);
  });
});
