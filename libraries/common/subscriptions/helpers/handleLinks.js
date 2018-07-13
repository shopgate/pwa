import flushTab from '@shopgate/pwa-core/commands/flushTab';
import openPage from '@shopgate/pwa-core/commands/openPage';
import showTab from '@shopgate/pwa-core/commands/showTab';
import popTabToRoot from '@shopgate/pwa-core/commands/popTabToRoot';
import { logger } from '@shopgate/pwa-core/helpers';
import pathMatch from 'path-match';
import authRoutes from '../../collections/AuthRoutes';

const matcher = pathMatch({
  sensitive: false,
  strict: false,
  end: true,
});

const PROTOCOL_HTTP = 'http:';
const PROTOCOL_HTTPS = 'https:';
const PROTOCOL_TEL = 'tel:';
const PROTOCOL_MAILTO = 'mailto:';

export const LEGACY_LINK_ACCOUNT = 'account';
export const LEGACY_LINK_STOREFINDER = 'storefinder';
export const LEGACY_LINK_CHANNEL = 'channel';
export const LEGACY_LINK_ORDERS = 'orders_legacy';
export const LEGACY_LINK_CART_ADD_COUPON = 'cart_add_coupon';
export const LEGACY_LINK_CHECKOUT = 'checkout_legacy';
export const LEGACY_LINK_REGISTER_LEGACY = 'register_legacy';
export const LEGACY_LINK_REGISTER = 'register';
export const LEGACY_LINK_CONNECT_REGISTER = 'connect_register';

const protocols = [PROTOCOL_HTTP, PROTOCOL_HTTPS, PROTOCOL_TEL, PROTOCOL_MAILTO];

const legacyPages = [
  '/page/terms',
  '/page/return_policy',
  '/page/privacy',
  '/page/imprint',
  '/page/shipping',
  '/page/payment',
  '/page/warranty',
];

const legacyLinks = [
  LEGACY_LINK_ACCOUNT,
  LEGACY_LINK_STOREFINDER,
  LEGACY_LINK_CHANNEL,
  LEGACY_LINK_ORDERS,
  LEGACY_LINK_CART_ADD_COUPON,
  LEGACY_LINK_CHECKOUT,
  LEGACY_LINK_REGISTER_LEGACY,
  LEGACY_LINK_REGISTER,
  LEGACY_LINK_CONNECT_REGISTER,
];

/**
 * Returns the segments of a URL.
 * @param {string} location The location to open.
 * @return {Array}
 */
export const getSegments = location => location.split('/').splice(1);

/**
 * Checks whether the location starts with a URL protocol.
 * @param {string} location The location to open.
 * @return {boolean}
 */
export const hasKnownProtocols = location => new RegExp(protocols.join('|')).test(location);

/**
 * Checks whether the location is an external link.
 * @param {string} location The location to open.
 * @return {boolean}
 */
export const isExternalLink = location => (
  location.startsWith(PROTOCOL_HTTP) || location.startsWith(PROTOCOL_HTTPS)
);

/**
 * Checks whether the location is an native link.
 * @param {string} location The location to open.
 * @return {boolean}
 */
export const isNativeLink = location => (
  location.startsWith(PROTOCOL_TEL) || location.startsWith(PROTOCOL_MAILTO)
);

/**
 * Checks whether the location is a legacy page.
 * @param {string} location The location to open.
 * @return {boolean}
 */
export const isLegacyPage = location => (
  legacyPages.includes(location)
);

/**
 * Checks whether it is a legacy link.
 * @param {string} location The location to open.
 * @return {boolean}
 */
export const isLegacyLink = location => (
  legacyLinks.includes(getSegments(location)[0])
);

/**
 * Opens a link in the in-app-broweser.
 * @param {string} location The location to open.
 */
export const openExternalLink = (location) => {
  showTab({
    targetTab: 'in_app_browser',
    animation: 'slideInFromBottom',
  });

  openPage({
    src: location,
    previewSrc: 'sgapi:page_preview',
    emulateBrowser: true,
    targetTab: 'in_app_browser',
    navigationBarParams: {
      type: 'in-app-browser-default',
      popTab: 'in_app_browser',
      animation: 'none',
    },
  });

  flushTab({
    targetTab: 'in_app_browser',
  });
};

/**
 * Opens an legacy link in the old system in the given targetTab.
 * @param {Object} options Options of the link.
 * @param {string} options.location Link url.
 * @param {string} options.targetTab Target tab where the page should be opened.
 * @param {string} options.navigationType Type of the navigation bar that should be displayed.
 * @param {string} options.popTabToRoot Type of the navigation bar that should be displayed.
 * @param {string} options.flushTab The tab that should be flushed
 * @param {Function} options.backCallback Function that is executed when hitting the back button.
 */
export const handleLegacyLink = (options) => {
  if (options.location) {
    let src = `sgapi:${options.location.substring(1)}`;
    // `sgapi` links must not end with slash.
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

  if (options.flushTab) {
    flushTab({
      targetTab: options.flushTab,
    });
  }

  if (options.popTabToRoot) {
    popTabToRoot({
      targetTab: options.targetTab,
    });
  }
};

/**
 * Opens a legacy CMS page.
 * @param {string} location The location to open.
 */
export const openLegacy = (location) => {
  handleLegacyLink({
    targetTab: 'main',
    location,
  });
};

/**
 * Opens a native link.
 * @param {string} location The location to open.
 */
export const openNativeLink = (location) => {
  window.location.href = location;
};

/**
 * Opens a legacy links.
 * @param {string} location The location to open.
 */
export const openLegacyLink = (location) => {
  switch (getSegments(location)[0]) {
    case LEGACY_LINK_ACCOUNT:
    case LEGACY_LINK_STOREFINDER:
    case LEGACY_LINK_CHANNEL:
      openLegacy(location);
      break;
    case LEGACY_LINK_ORDERS:
      handleLegacyLink({
        targetTab: 'main',
        location: '/orders',
      });
      break;
    case LEGACY_LINK_CHECKOUT:
      handleLegacyLink({
        targetTab: 'cart',
        flushTab: 'cart',
        navigationType: 'checkout',
        location: '/checkout/default',
        backCallback: 'SGAction.popTabToRoot(); SGAction.showTab({ targetTab: "main" });',
      });
      break;
    case LEGACY_LINK_REGISTER:
    case LEGACY_LINK_REGISTER_LEGACY:
      handleLegacyLink({
        targetTab: 'main',
        location: '/register/default',
      });
      break;
    case LEGACY_LINK_CONNECT_REGISTER:
      handleLegacyLink({
        location: `/${LEGACY_LINK_CONNECT_REGISTER}`,
        targetTab: 'main',
        backCallback: 'SGAction.popTabToRoot(); SGAction.showTab({ targetTab: "main" });',
      });
      break;
    case LEGACY_LINK_CART_ADD_COUPON:
    default:
      logger.warn(`openLegacyLink not handled: ${location}`);
      break;
  }
};

/**
 * Check if the given pathname is a protected route.
 * @param {string} location The location to check.
 * @returns {boolean}
 */
export const getProtector = (location) => {
  /**
   * Try to make a direct match with the location.
   * If we get lucky then we don't have to iterate over the protected patterns.
   */
  let protector = authRoutes.get(location);

  /**
   * If we didn't find a direct match then we need to match
   * the given location against the protected patters.
   */
  if (!protector) {
    // Get the protected patterns as an array.
    const patterns = Array.from(authRoutes.getAll().keys());

    // Loop over the patterns until a match is found.
    patterns.some((pattern) => {
      // Check for a match.
      const match = matcher(pattern)(location);

      // Match found, set the proector.
      if (match) {
        protector = authRoutes.get(pattern);
      }

      return match;
    });
  }

  return protector;
};
