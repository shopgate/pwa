import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import {
  getAreAppSettingsHydrated,
  getCategorySettings,
} from '@shopgate/engage/settings/selectors/appSettings';
import type { CategorySettings } from '@shopgate/engage/settings/types/appSettings';
import useCategorySettings from './useCategorySettings';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage', () => ({ appConfig: { categoriesShowAllProducts: true } }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: jest.fn(),
  getCategorySettings: jest.fn(),
}));

const settings: CategorySettings = {
  layout: 'grid',
  grid: {
    columns: {
      small: 2,
      large: 4,
    },
  },
  showImages: false,
  showAllProducts: false,
};

const renderHook = (hydrated: boolean) => {
  (useSelector as jest.Mock).mockImplementation((selector: unknown) => {
    if (selector === getAreAppSettingsHydrated) {
      return hydrated;
    }
    return selector === getCategorySettings ? settings : undefined;
  });

  let result: CategorySettings | undefined;
  const Consumer = () => {
    result = useCategorySettings();
    return null;
  };
  render(<Consumer />);
  return result;
};

describe('useCategorySettings', () => {
  it('shows all products like the legacy app config before hydration', () => {
    expect(renderHook(false)).toEqual({
      ...settings,
      showAllProducts: true,
    });
  });

  it('uses the app settings once hydrated', () => {
    expect(renderHook(true)).toEqual(settings);
  });
});
