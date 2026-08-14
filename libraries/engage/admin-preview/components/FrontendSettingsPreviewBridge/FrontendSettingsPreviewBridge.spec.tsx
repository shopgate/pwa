import { act, render } from '@testing-library/react';
import { logger } from '@shopgate/engage/core/helpers';
import { RECEIVE_APP_SETTINGS } from '@shopgate/engage/settings/constants/appSettings';
import useColorScheme from '@shopgate/engage/styles/theme/hooks/useColorScheme';
import type { AppSettingsPayload } from '@shopgate/engage/settings/types/appSettings';
import FrontendSettingsPreviewBridge from './FrontendSettingsPreviewBridge';
import { PREVIEW_STYLE_TAG_ID } from './helpers';
import type { FrontendSettingsPreviewBridgeMessage } from './types';

const appSettings: AppSettingsPayload = {
  navigation: {
    tabBar: {
      variant: 'fixed',
      transition: 'fade',
      showLabels: true,
      hideOnScroll: false,
      fixed: { borderEnabled: true },
      favorites: { showCounter: true },
    },
  },
  product: {
    grid: {
      columns: {
        small: 2,
        large: 4,
      },
    },
    card: { productName: { maxLines: 3 } },
    tile: { productName: { maxLines: 3 } },
    slider: {
      slidesPerView: {
        small: 2.3,
        medium: 3.3,
        large: 4.3,
      },
    },
    rating: {
      showEmptyStars: true,
    },
  },
  images: {
    quality: 75,
    fillColor: 'FFFFFF',
    fillTransparent: true,
    product: {
      ratio: {
        width: 1,
        height: 1,
      },
      showInnerShadow: false,
    },
  },
};

const mockedDispatch = jest.fn();
const mockedSetMode = jest.fn();
const mockedSendToParent = jest.fn();
const mockedLoadFontCss = jest.fn();

/**
 * What the bridge's font css url selector resolves to. Set per test.
 */
let mockedFontCssUrls: string[] = [];

/**
 * Holds the callback the bridge registered with useIframeMessenger, so tests can simulate an
 * incoming message without going through postMessage.
 */
let onMessage: (data: FrontendSettingsPreviewBridgeMessage) => void;

/**
 * Simulates a message arriving from the admin parent window.
 * @param data The message to deliver to the bridge.
 */
const sendMessage = (data: FrontendSettingsPreviewBridgeMessage) => {
  act(() => {
    onMessage(data);
  });
};

jest.mock('react-redux', () => ({
  useDispatch: () => mockedDispatch,
  useSelector: () => mockedFontCssUrls,
}));

jest.mock('@shopgate/engage/styles/helpers/loadFontCss', () => ({
  loadFontCss: (...args: unknown[]) => mockedLoadFontCss(...args),
}));

jest.mock('@shopgate/engage/admin-preview/hooks', () => ({
  useIframeMessenger: (callback: typeof onMessage) => {
    onMessage = callback;
    return { sendToParent: mockedSendToParent };
  },
}));

jest.mock('@shopgate/engage/styles/theme/hooks/useColorScheme', () => jest.fn());

jest.mock('@shopgate/engage/core/helpers', () => ({
  logger: { warn: jest.fn() },
}));

describe('engage > admin-preview > FrontendSettingsPreviewBridge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFontCssUrls = [];
    (useColorScheme as jest.Mock).mockReturnValue({
      mode: 'light',
      setMode: mockedSetMode,
      modes: ['light', 'dark'],
    });
    document.getElementById(PREVIEW_STYLE_TAG_ID)?.remove();
  });

  describe('font css', () => {
    it('should sync the configured font files', () => {
      mockedFontCssUrls = ['https://cdn.example/h1.css'];

      render(<FrontendSettingsPreviewBridge />);

      expect(mockedLoadFontCss).toHaveBeenCalledWith(mockedFontCssUrls);
    });

    it('should sync an empty list, so cleared files are removed', () => {
      render(<FrontendSettingsPreviewBridge />);

      expect(mockedLoadFontCss).toHaveBeenCalledWith([]);
    });
  });

  describe('setColorScheme', () => {
    it('should apply a valid color scheme', () => {
      render(<FrontendSettingsPreviewBridge />);

      sendMessage({
        type: 'setColorScheme',
        payload: { colorScheme: 'dark' },
      });

      expect(mockedSetMode).toHaveBeenCalledWith('dark');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it.each([
      ['an unknown scheme', { colorScheme: 'blue' }],
      ['a missing scheme', {}],
      ['a missing payload', undefined],
    ])('should ignore and log %s', (_, payload) => {
      render(<FrontendSettingsPreviewBridge />);

      sendMessage({
        type: 'setColorScheme',
        payload,
      } as FrontendSettingsPreviewBridgeMessage);

      expect(mockedSetMode).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should ignore a scheme that is not among the available modes', () => {
      (useColorScheme as jest.Mock).mockReturnValue({
        mode: 'light',
        setMode: mockedSetMode,
        modes: ['light'],
      });
      render(<FrontendSettingsPreviewBridge />);

      sendMessage({
        type: 'setColorScheme',
        payload: { colorScheme: 'dark' },
      });

      expect(mockedSetMode).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  describe('receiveFrontendSettings', () => {
    it('should apply the received styling to the preview style tag', () => {
      render(<FrontendSettingsPreviewBridge />);

      sendMessage({
        type: 'receiveFrontendSettings',
        payload: { styling: { '.button': { backgroundColor: 'red' } } },
      });

      expect(document.getElementById(PREVIEW_STYLE_TAG_ID)?.textContent)
        .toBe('.button { background-color: red; }');
    });

    it('should dispatch the received app settings', () => {
      render(<FrontendSettingsPreviewBridge />);

      sendMessage({
        type: 'receiveFrontendSettings',
        payload: { appSettings },
      });

      expect(mockedDispatch).toHaveBeenCalledWith({
        type: RECEIVE_APP_SETTINGS,
        settings: appSettings,
      });
    });

    it('should not touch the color scheme', () => {
      render(<FrontendSettingsPreviewBridge />);

      sendMessage({
        type: 'receiveFrontendSettings',
        payload: { styling: {} },
      });

      expect(mockedSetMode).not.toHaveBeenCalled();
    });
  });

  it('should announce readiness to the parent on mount', () => {
    render(<FrontendSettingsPreviewBridge />);

    expect(mockedSendToParent).toHaveBeenCalledWith({ type: 'frontendSettingsPreviewReady' });
  });
});
