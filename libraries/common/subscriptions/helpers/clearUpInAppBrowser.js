import cleanTab from '@shopgate/pwa-core/commands/cleanTab';

/**
 * @param {boolean} isAndroid Tells if the function was called on an Android device.
 */
const clearUpInAppBrowser = (isAndroid) => {
  /**
   * Remove leftover pages from the inAppBrowser on Android when the PWA view reappears.
   * Otherwise it the previous page would get visible again when the native back button is pressed.
   */
  if (isAndroid) {
    cleanTab({
      targetTab: 'in_app_browser',
    });
  }
};

export default clearUpInAppBrowser;
