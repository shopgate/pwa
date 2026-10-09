import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  getAreAppSettingsHydrated,
  getProductGallerySettings,
} from '@shopgate/engage/settings/selectors/appSettings';
import type { ProductGallerySettings } from '@shopgate/engage/settings/types/appSettings';
import useProductGallerySettings from './useProductGallerySettings';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/pwa-common/helpers/config', () => ({}));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: jest.fn(),
  getProductGallerySettings: jest.fn(),
}));

const setup = (hydrated: boolean, legacyPagination?: string) => {
  (useSelector as jest.Mock).mockImplementation((selector: unknown) => {
    if (selector === getAreAppSettingsHydrated) {
      return hydrated;
    }
    if (selector === getProductGallerySettings) {
      return { pagination: 'fraction' };
    }
    return undefined;
  });
  (appConfig as { pdpImageSliderPaginationType?: string }).pdpImageSliderPaginationType =
    legacyPagination;
};

const renderHook = () => {
  let result: ProductGallerySettings | undefined;
  const Consumer = () => {
    result = useProductGallerySettings();
    return null;
  };
  render(<Consumer />);
  return result;
};

describe('useProductGallerySettings', () => {
  it('follows the legacy app config before hydration', () => {
    setup(false, 'bulletsBelow');
    expect(renderHook()).toEqual({ pagination: 'bulletsBelow' });
  });

  it('ignores an unknown legacy pagination before hydration', () => {
    setup(false, 'dots');
    expect(renderHook()).toEqual({ pagination: 'fraction' });
  });

  it('uses the default before hydration without a legacy pagination', () => {
    setup(false);
    expect(renderHook()).toEqual({ pagination: 'fraction' });
  });

  it('uses the app settings once hydrated', () => {
    setup(true, 'bulletsBelow');
    expect(renderHook()).toEqual({ pagination: 'fraction' });
  });
});
