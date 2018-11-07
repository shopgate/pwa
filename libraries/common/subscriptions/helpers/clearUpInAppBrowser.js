import popTabToRoot from '@shopgate/pwa-core/commands/popTabToRoot';
import cleanTab from '@shopgate/pwa-core/commands/cleanTab';

/**
 * @param {boolean} isAndroid Tells if the function was called on an Android device.
 */
const clearUpInAppBrowser = (isAndroid) => {
  const params = {
    targetTab: 'in_app_browser',
  };

  /**
   * Remove leftover pages from the inAppBrowser when the PWA view reappears.
   * Depending on the app, a different strategy is needed.
   */
  if (isAndroid) {
    cleanTab(params);
  } else {
    popTabToRoot(params);
  }
};

export default clearUpInAppBrowser;
