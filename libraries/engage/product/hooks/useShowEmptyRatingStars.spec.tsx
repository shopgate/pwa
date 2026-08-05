import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import {
  getAreAppSettingsHydrated,
  getShowEmptyRatingStars,
} from '@shopgate/engage/settings/selectors/appSettings';
import useShowEmptyRatingStars from './useShowEmptyRatingStars';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage/core/hooks', () => ({ useWidgetSettings: jest.fn() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: jest.fn(),
  getShowEmptyRatingStars: jest.fn(),
}));

interface SetupOptions {
  hydrated: boolean;
  appSettingsValue: boolean;
  widgetSettings: { showEmptyRatingStars?: boolean };
}

// Configures the mocked dependencies for a single render.
const setup = ({ hydrated, appSettingsValue, widgetSettings }: SetupOptions) => {
  (useSelector as jest.Mock).mockImplementation((selector: unknown) => {
    if (selector === getAreAppSettingsHydrated) {
      return hydrated;
    }
    if (selector === getShowEmptyRatingStars) {
      return appSettingsValue;
    }
    return undefined;
  });
  (useWidgetSettings as jest.Mock).mockReturnValue(widgetSettings);
};

// Renders the hook and returns its result.
const renderHook = (): boolean | undefined => {
  let result: boolean | undefined;

  const Consumer = () => {
    result = useShowEmptyRatingStars();
    return null;
  };

  render(<Consumer />);

  return result;
};

describe('useShowEmptyRatingStars', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('honors the legacy widget setting before hydration', () => {
    setup({
      hydrated: false,
      appSettingsValue: true,
      widgetSettings: { showEmptyRatingStars: true },
    });
    expect(renderHook()).toBe(true);

    setup({
      hydrated: false,
      appSettingsValue: true,
      widgetSettings: { showEmptyRatingStars: false },
    });
    expect(renderHook()).toBe(false);
  });

  it('keeps the legacy default of false when the widget setting is missing', () => {
    setup({ hydrated: false, appSettingsValue: true, widgetSettings: {} });
    expect(renderHook()).toBe(false);
  });

  it('uses the app settings once hydrated', () => {
    setup({
      hydrated: true,
      appSettingsValue: true,
      widgetSettings: { showEmptyRatingStars: false },
    });
    expect(renderHook()).toBe(true);

    setup({
      hydrated: true,
      appSettingsValue: false,
      widgetSettings: { showEmptyRatingStars: true },
    });
    expect(renderHook()).toBe(false);
  });
});
