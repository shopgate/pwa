import { isIos } from '@shopgate/pwa-common/selectors/client';
import { updateLegacyNavigationBar } from '../../helpers/updateLegacyNavigationBar';
import updateStatusBarBackground from '../updateStatusBarBackground';

jest.mock('../../helpers/updateLegacyNavigationBar', () => ({
  updateLegacyNavigationBar: jest.fn(),
}));

jest.mock('@shopgate/pwa-common/selectors/client', () => ({
  isIos: jest.fn().mockReturnValue(true),
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
});
