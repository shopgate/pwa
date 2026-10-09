import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import {
  getAreAppSettingsHydrated,
  getProductFilterBarSettings,
} from '@shopgate/engage/settings/selectors/appSettings';
import type { ProductFilterBarSettings } from '@shopgate/engage/settings/types/appSettings';
import useFilterBarSettings from './useFilterBarSettings';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage/core/hooks', () => ({ useWidgetSettings: jest.fn() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: jest.fn(),
  getProductFilterBarSettings: jest.fn(),
}));

const setup = (hydrated: boolean, widgetSettings: { hideOnScroll?: boolean } | null) => {
  (useSelector as jest.Mock).mockImplementation((selector: unknown) => {
    if (selector === getAreAppSettingsHydrated) {
      return hydrated;
    }
    if (selector === getProductFilterBarSettings) {
      return {
        showSubcategoryChips: true,
        showOnParentCategories: true,
        hideOnScroll: false,
      };
    }
    return undefined;
  });
  (useWidgetSettings as jest.Mock).mockReturnValue(widgetSettings);
};

const renderHook = () => {
  let result: ProductFilterBarSettings | undefined;
  const Consumer = () => {
    result = useFilterBarSettings();
    return null;
  };
  render(<Consumer />);
  return result;
};

describe('useFilterBarSettings', () => {
  it('hides on scroll like the legacy widget setting before hydration', () => {
    setup(false, { hideOnScroll: true });
    expect(renderHook()).toEqual({
      showSubcategoryChips: true,
      showOnParentCategories: true,
      hideOnScroll: true,
    });
  });

  it('hides on scroll by default before hydration without a legacy setting', () => {
    setup(false, null);
    expect(renderHook()?.hideOnScroll).toBe(true);
  });

  it('uses the app settings once hydrated', () => {
    setup(true, { hideOnScroll: true });
    expect(renderHook()).toEqual({
      showSubcategoryChips: true,
      showOnParentCategories: true,
      hideOnScroll: false,
    });
  });
});
