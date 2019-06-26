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
        },
        statusBarStyle: 'light',
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
});
