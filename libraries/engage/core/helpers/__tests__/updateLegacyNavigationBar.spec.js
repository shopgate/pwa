import { broadcastEvent } from '../../index';
import { updateLegacyNavigationBar } from '../updateLegacyNavigationBar';

jest.mock('../../index', () => ({
  broadcastEvent: jest.fn(),
}));

describe('updateLegacyNavigationBar()', () => {
  it('should broadcast when called without parameters', () => {
    updateLegacyNavigationBar();
    expect(broadcastEvent).toHaveBeenCalledWith({
      event: 'updateNavigationBarStyle',
      parameters: [{
        targetTab: 'main',
        styles: {},
      }],
    });
  });

  it('should broadcast when called with colors that contain a bright background', () => {
    const options = {
      color: '#000',
      background: '#fff',
      buttonColor: 'red',
      buttonColorDisabled: 'blue',
    };
    updateLegacyNavigationBar(options);
    expect(broadcastEvent).toHaveBeenCalledWith({
      event: 'updateNavigationBarStyle',
      parameters: [{
        targetTab: 'main',
        styles: {
          ...options,
          statusBarBackground: options.background,
        },
        statusBarStyle: 'dark',
      }],
    });
  });

  it('should broadcast when called with colors that contain a light background', () => {
    const options = {
      background: '#000',
    };
    updateLegacyNavigationBar(options);
    expect(broadcastEvent).toHaveBeenCalledWith({
      event: 'updateNavigationBarStyle',
      parameters: [{
        targetTab: 'main',
        styles: {
          ...options,
          statusBarBackground: options.background,
        },
        statusBarStyle: 'light',
      }],
    });
  });

  it('should broadcast when called with a status bar background', () => {
    const options = {
      statusBarBackground: '#fff',
    };
    updateLegacyNavigationBar(options);
    expect(broadcastEvent).toHaveBeenCalledWith({
      event: 'updateNavigationBarStyle',
      parameters: [{
        targetTab: 'main',
        styles: {
          ...options,
        },
        statusBarStyle: 'dark',
      }],
    });
  });

  it('should broadcast when called with custom targetTab and statusBarStyle', () => {
    const options = {
      statusBarStyle: 'dark',
      targetTab: 'cart',
    };
    updateLegacyNavigationBar(options);
    expect(broadcastEvent).toHaveBeenCalledWith({
      event: 'updateNavigationBarStyle',
      parameters: [{
        targetTab: 'cart',
        styles: {},
        statusBarStyle: 'dark',
      }],
    });
  });

  it('should broadcast when called with the isDefault option', () => {
    const options = {
      isDefault: true,
      statusBarStyle: 'dark',
      targetTab: 'cart',
      statusBarBackground: 'red',
    };
    updateLegacyNavigationBar(options);
    expect(broadcastEvent).toHaveBeenCalledWith({
      event: 'updateNavigationBarStyle',
      parameters: [{
        isDefault: true,
        targetTab: 'cart',
        styles: {
          statusBarBackground: 'red',
        },
        statusBarStyle: 'dark',
      }],
    });
  });
});
