import openPage from '@shopgate/pwa-core/commands/openPage';
import showTab from '@shopgate/pwa-core/commands/showTab';
import { getPageContext } from '../../../../helpers/legacy';
import { isFunction } from '../../../../helpers/validation';

/**
 * Native link handler, simply changes current location.href to open email, tel, etc..
 * @param {string} url Url that should be natively handled.
 */
const native = (url) => {
  window.location.href = url;
};

/**
 * Push Notification handler.
 */
const pushNotification = () => {};

/**
 * External link that should be opened in the in app browser.
 * @param {string} url Url that should be opened.
 */
const externalLink = (url) => {
  showTab({
    targetTab: 'in_app_browser',
    animation: 'slideInFromBottom',
  });

  openPage({
    src: url,
    previewSrc: 'sgapi:page_preview',
    emulateBrowser: true,
    targetTab: 'in_app_browser',
    navigationBarParams: {
      type: 'in-app-browser-default',
      popTab: 'in_app_browser',
      animation: 'none',
    },
  });
};

/**
 * Opens an legacy link in the old system in the given targetTab.
 * @param {Object} options Options of the link.
 * @param {string} options.url Link url.
 * @param {string} options.targetTab Target tab where the page should be opened.
 * @param {string} options.navigationType Type of the navigation bar that should be displayed.
 * @param {string} options.backCallback
 *   Javascript callback that is executed when hitting the back button.
 */
const legacyLink = (options) => {
  if (options.url) {
    let src = `sgapi:${options.url.substring(1)}`;
    // Sgapi links must not end with slash.
    if (src.endsWith('/')) {
      src = src.slice(0, -1);
    }

    openPage({
      src,
      previewSrc: 'sgapi:page_preview',
      targetTab: options.targetTab,
      animated: false,
      navigationBarParams: {
        type: options.navigationType ? options.navigationType : 'default',
        leftButtonCallback: options.backCallback ? options.backCallback : '',
      },
    });
  }

  if (options.targetTab) {
    showTab({
      targetTab: options.targetTab,
    });
  }
};

/**
 * Opens a link using a history handler. This can be a router history object or a function.
 * @param {Object} options The location options.
 * @param {Object|Function} historyHandler The history handler.
 */
const reactRouter = (options, historyHandler) => {
  const pageContext = getPageContext();

  showTab({
    targetTab: pageContext.tab,
  });

  if (isFunction(historyHandler)) {
    historyHandler(options);
    return;
  }

  historyHandler.push(options.url);
};

export default {
  native,
  externalLink,
  legacyLink,
  reactRouter,
  pushNotification,
};
