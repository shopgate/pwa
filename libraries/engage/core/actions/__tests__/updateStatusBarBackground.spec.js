import { isIos } from '@shopgate/pwa-common/selectors/client';
import { appSupportsInAppBrowserColors } from '@shopgate/engage/core/helpers';
import { updateLegacyNavigationBar } from '../../helpers/updateLegacyNavigationBar';
import updateStatusBarBackground from '../updateStatusBarBackground';

jest.mock('../../helpers/updateLegacyNavigationBar', () => ({
  updateLegacyNavigationBar: jest.fn(),
}));

jest.mock('@shopgate/native-modules', () => ({
  isAvailable: jest.fn(() => false),
}));

jest.mock('@shopgate/pwa-common/selectors/client', () => ({
  isIos: jest.fn().mockReturnValue(true),
}));

jest.mock('@shopgate/engage/core/helpers', () => ({
  appSupportsAndroidEdgeToEdge: jest.fn(() => false),
  appSupportsInAppBrowserColors: jest.fn(() => false),
}));

jest.mock('@shopgate/engage/styles/helpers/cssCustomProperties', () => ({
  getCSSCustomProp: jest.fn(key => ({
    '--sg-components-appBar-background': '#1c1c1e',
    '--sg-components-appBar-color': 'rgb(255, 204, 0)',
    '--sg-palette-background-default': '#000000',
  }[key])),
}));

describe('engage > core > actions > updateStatusBarBackground()', () => {
  const color = '#000';
  const state = { some: 'state' };
  const getState = jest.fn().mockReturnValue(state);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do nothing when the device does not run with iOS', () => {
    isIos.mockReturnValueOnce(false);
    updateStatusBarBackground(color)(null, getState);
    expect(isIos).toHaveBeenCalledWith(state);
    expect(updateLegacyNavigationBar).not.toHaveBeenCalled();
  });

  it('should call the updateLegacyNavigationBar helper with the passed color', () => {
    updateStatusBarBackground(color)(null, getState);
    expect(isIos).toHaveBeenCalledWith(state);
    expect(updateLegacyNavigationBar).toHaveBeenCalledTimes(1);
    expect(updateLegacyNavigationBar).toHaveBeenCalledWith({
      statusBarBackground: color,
      isDefault: false,
    });
  });

  it('should call the updateLegacyNavigationBar helper with the isDefault flag', () => {
    updateStatusBarBackground(null, true)(null, getState);
    expect(isIos).toHaveBeenCalledWith(state);
    expect(updateLegacyNavigationBar).toHaveBeenCalledTimes(1);
    expect(updateLegacyNavigationBar).toHaveBeenCalledWith({
      isDefault: true,
    });
  });

  it('should call the updateLegacyNavigationBar helper with just the isDefault property when no color was passed', () => {
    updateStatusBarBackground()(null, getState);
    expect(isIos).toHaveBeenCalledWith(state);
    expect(updateLegacyNavigationBar).toHaveBeenCalledTimes(1);
    expect(updateLegacyNavigationBar).toHaveBeenCalledWith({ isDefault: false });
  });

  it('should pass the colors of the app bar when the app themes its in-app browser', () => {
    appSupportsInAppBrowserColors.mockReturnValueOnce(true);
    updateStatusBarBackground('transparent')(null, getState);
    expect(updateLegacyNavigationBar).toHaveBeenCalledWith({
      statusBarBackground: 'transparent',
      inAppBrowser: {
        styles: {
          background: '#1c1c1e',
          color: 'rgb(255, 204, 0)',
          contentBackground: '#000000',
        },
        statusBarStyle: 'light',
      },
      isDefault: false,
    });
  });

  it('should call the updateLegacyNavigationBar helper on Android when the app themes its in-app browser', () => {
    isIos.mockReturnValueOnce(false);
    appSupportsInAppBrowserColors.mockReturnValueOnce(true);
    updateStatusBarBackground(color)(null, getState);
    expect(updateLegacyNavigationBar).toHaveBeenCalledTimes(1);
  });
});
