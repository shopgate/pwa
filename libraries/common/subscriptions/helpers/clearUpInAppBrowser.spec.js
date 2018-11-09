import cleanTab from '@shopgate/pwa-core/commands/cleanTab';
import clearUpInAppBrowser from './clearUpInAppBrowser';

jest.mock('@shopgate/pwa-core/commands/popTabToRoot', () => jest.fn());
jest.mock('@shopgate/pwa-core/commands/cleanTab', () => jest.fn());

describe('clearUpInAppBrowser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the cleanTab command on Android devices', () => {
    clearUpInAppBrowser(true);
    expect(cleanTab).toHaveBeenCalled();
  });

  it('should call the popTabToRoot command on iOS devices', () => {
    clearUpInAppBrowser(false);
    expect(cleanTab).not.toHaveBeenCalled();
  });
});
