import flushTab from '@shopgate/pwa-core/commands/flushTab';
import openPage from '@shopgate/pwa-core/commands/openPage';
import popTabToRoot from '@shopgate/pwa-core/commands/popTabToRoot';
import showTab from '@shopgate/pwa-core/commands/showTab';
import actions from './actions';

/**
 * Mock the commands.
 */
jest.mock('@shopgate/pwa-core/commands/flushTab', () => jest.fn());
jest.mock('@shopgate/pwa-core/commands/openPage', () => jest.fn());
jest.mock('@shopgate/pwa-core/commands/popTabToRoot', () => jest.fn());
jest.mock('@shopgate/pwa-core/commands/showTab', () => jest.fn());

/**
 * Reset all imported mock functions
 */
const resetMocks = () => {
  showTab.mockReset();
  flushTab.mockReset();
  popTabToRoot.mockReset();
  openPage.mockReset();
};

describe('Tests link actions', () => {
  describe('Tests reactRouter action', () => {
    it('should open link using history.push', () => {
      const push = jest.fn();
      const history = { push };
      actions.reactRouter({ url: '/category/123' }, history);

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith('/category/123');
    });
  });

  describe('Tests external link', () => {
    it('should open a link in the in app browser', () => {
      resetMocks();
      actions.externalLink('http://google.de');

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(showTab).toHaveBeenCalledWith({ targetTab: 'in_app_browser', animation: 'slideInFromBottom' });
      expect(openPage).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledWith({
        src: 'http://google.de',
        previewSrc: 'sgapi:page_preview',
        emulateBrowser: true,
        targetTab: 'in_app_browser',
        animated: false,
        navigationBarParams: {
          type: 'in-app-browser-default',
          popTab: 'in_app_browser',
          animation: 'none',
        },
      });
    });
  });

  describe('Tests legacy links', () => {
    it('should open a link without any special configuration', () => {
      resetMocks();
      actions.legacyLink({
        url: '/cart',
        targetTab: 'main',
      });

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledWith({
        src: 'sgapi:cart',
        previewSrc: 'sgapi:page_preview',
        targetTab: 'main',
        animated: false,
        navigationBarParams: {
          type: 'default',
          leftButtonCallback: '',
        },
      });
      expect(popTabToRoot).toHaveBeenCalledTimes(0);
    });

    it('should open a link with navigationType', () => {
      resetMocks();
      actions.legacyLink({
        url: '/cart',
        targetTab: 'main',
        navigationType:
        'cart-index',
      });

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledWith({
        src: 'sgapi:cart',
        previewSrc: 'sgapi:page_preview',
        targetTab: 'main',
        animated: false,
        navigationBarParams: {
          type: 'cart-index',
          leftButtonCallback: '',
        },
      });
      expect(popTabToRoot).toHaveBeenCalledTimes(0);
    });

    it('should open a link in a different tab', () => {
      resetMocks();
      actions.legacyLink({
        url: '/cart',
        targetTab: 'cart',
      });

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(showTab).toHaveBeenCalledWith({ targetTab: 'cart' });
      expect(openPage).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledWith({
        src: 'sgapi:cart',
        previewSrc: 'sgapi:page_preview',
        targetTab: 'cart',
        animated: false,
        navigationBarParams: {
          type: 'default',
          leftButtonCallback: '',
        },
      });
      expect(popTabToRoot).toHaveBeenCalledTimes(0);
    });

    it('should open a link in a different tab and do popTabToRoot', () => {
      resetMocks();
      actions.legacyLink({
        url: '/cart',
        targetTab: 'cart',
        popTabToRoot: true,
        backCallback: 'SGAction.popTabToRoot()',
      });

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(showTab).toHaveBeenCalledWith({ targetTab: 'cart' });
      expect(openPage).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledWith({
        src: 'sgapi:cart',
        previewSrc: 'sgapi:page_preview',
        targetTab: 'cart',
        animated: false,
        navigationBarParams: {
          type: 'default',
          leftButtonCallback: 'SGAction.popTabToRoot()',
        },
      });
      expect(showTab).toHaveBeenCalledWith({ targetTab: 'cart' });
    });
  });
});
