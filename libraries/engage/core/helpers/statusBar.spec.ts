import { isAvailable, StatusBar } from '@shopgate/native-modules';
import { setStatusBarHidden } from './statusBar';

jest.mock('@shopgate/native-modules', () => ({
  isAvailable: jest.fn(),
  StatusBar: { setHidden: jest.fn(() => Promise.resolve()) },
}));

describe('engage/core/helpers/statusBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hides and shows the status bar through the native modules', () => {
    (isAvailable as jest.Mock).mockReturnValue(true);

    setStatusBarHidden(true);
    setStatusBarHidden(false);

    expect(StatusBar.setHidden).toHaveBeenNthCalledWith(1, {
      hidden: true,
      animation: 'fade',
    });
    expect(StatusBar.setHidden).toHaveBeenNthCalledWith(2, {
      hidden: false,
      animation: 'fade',
    });
  });

  it('does nothing without native modules', () => {
    (isAvailable as jest.Mock).mockReturnValue(false);

    setStatusBarHidden(true);

    expect(StatusBar.setHidden).not.toHaveBeenCalled();
  });

  it('ignores a failing native call', async () => {
    (isAvailable as jest.Mock).mockReturnValue(true);
    (StatusBar.setHidden as jest.Mock).mockReturnValueOnce(Promise.reject(new Error('unsupported')));

    expect(() => setStatusBarHidden(true)).not.toThrow();
    await Promise.resolve();
  });
});
