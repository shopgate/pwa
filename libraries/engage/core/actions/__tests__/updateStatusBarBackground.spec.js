import { isAvailable } from '@shopgate/native-modules';
import { isIos } from '@shopgate/pwa-common/selectors/client';
import { getCSSCustomProp } from '@shopgate/engage/styles/helpers/cssCustomProperties';
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

jest.mock('@shopgate/engage/styles/helpers/cssCustomProperties', () => ({
  getCSSCustomProp: jest.fn(() => ''),
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

  it('should pass the text color along with the background', () => {
    updateStatusBarBackground(color, false, 'rgb(255, 255, 255)')(null, getState);
    expect(updateLegacyNavigationBar).toHaveBeenCalledWith({
      statusBarBackground: color,
      color: 'rgb(255, 255, 255)',
      isDefault: false,
    });
  });

  it('should pass the page background along with the color', () => {
    getCSSCustomProp.mockReturnValueOnce('#1c1c1e');
    updateStatusBarBackground(color)(null, getState);
    expect(getCSSCustomProp).toHaveBeenCalledWith('--sg-palette-background-default');
    expect(updateLegacyNavigationBar).toHaveBeenCalledWith({
      statusBarBackground: color,
      contentBackground: '#1c1c1e',
      isDefault: false,
    });
  });

  it('should call the updateLegacyNavigationBar helper on Android when the React Native app is available', () => {
    isIos.mockReturnValueOnce(false);
    isAvailable.mockReturnValueOnce(true);
    updateStatusBarBackground(color)(null, getState);
    expect(updateLegacyNavigationBar).toHaveBeenCalledWith({
      statusBarBackground: color,
      isDefault: false,
    });
  });
});
