import {
  detectAdminPreview,
  detectFrontendSettingsAdminPreview,
  detectPageAdminPreview,
} from './_internal/detection';
import {
  isAdminPreviewActive,
  isFrontendSettingsAdminPreviewActive,
  isNavigationBlocked,
  isPageAdminPreviewActive,
} from './index';

jest.mock('./_internal/detection', () => ({
  detectAdminPreview: jest.fn(),
  detectFrontendSettingsAdminPreview: jest.fn(),
  detectPageAdminPreview: jest.fn(),
}));

const detectAdminPreviewMock = detectAdminPreview as jest.Mock;
const detectFrontendSettingsAdminPreviewMock = detectFrontendSettingsAdminPreview as jest.Mock;
const detectPageAdminPreviewMock = detectPageAdminPreview as jest.Mock;

describe('admin-preview helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isAdminPreviewActive', () => {
    it.each([true, false])('maps to detectAdminPreview -> %s', (detected) => {
      detectAdminPreviewMock.mockReturnValue(detected);

      expect(isAdminPreviewActive()).toBe(detected);
    });
  });

  describe('isPageAdminPreviewActive', () => {
    it.each([true, false])('maps to detectPageAdminPreview -> %s', (detected) => {
      detectPageAdminPreviewMock.mockReturnValue(detected);

      expect(isPageAdminPreviewActive()).toBe(detected);
    });
  });

  describe('isFrontendSettingsAdminPreviewActive', () => {
    it.each([true, false])('maps to detectFrontendSettingsAdminPreview -> %s', (detected) => {
      detectFrontendSettingsAdminPreviewMock.mockReturnValue(detected);

      expect(isFrontendSettingsAdminPreviewActive()).toBe(detected);
    });
  });

  describe('isNavigationBlocked', () => {
    it('is true in page admin preview mode', () => {
      detectPageAdminPreviewMock.mockReturnValue(true);

      expect(isNavigationBlocked()).toBe(true);
    });

    it('is false outside of page admin preview mode', () => {
      detectPageAdminPreviewMock.mockReturnValue(false);

      expect(isNavigationBlocked()).toBe(false);
    });

    it('is not affected by frontend settings preview mode', () => {
      detectPageAdminPreviewMock.mockReturnValue(false);
      detectFrontendSettingsAdminPreviewMock.mockReturnValue(true);

      expect(isNavigationBlocked()).toBe(false);
    });

    it('re-evaluates on every call', () => {
      detectPageAdminPreviewMock.mockReturnValue(false);
      expect(isNavigationBlocked()).toBe(false);

      detectPageAdminPreviewMock.mockReturnValue(true);
      expect(isNavigationBlocked()).toBe(true);
    });
  });
});
