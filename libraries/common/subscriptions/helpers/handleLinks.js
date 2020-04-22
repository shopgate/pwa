import { router, ACTION_REPLACE } from '@virtuous/conductor';
import flushTab from '@shopgate/pwa-core/commands/flushTab';
import openPage from '@shopgate/pwa-core/commands/openPage';
import showTab from '@shopgate/pwa-core/commands/showTab';
import { openPageExtern } from '@shopgate/pwa-core';
import { logger, hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import authRoutes from '../../collections/AuthRoutes';

const SHOPGATE_DOMAIN = 'shopgate.com';
const SHOPGATEPG_DOMAIN = 'shopgatepg.com';
const SHOPGATE_DOMAINS = [
  SHOPGATE_DOMAIN,
  `www.${SHOPGATE_DOMAIN}`,
];

const PROTOCOL_HTTP = 'http:';
const PROTOCOL_HTTPS = 'https:';
const PROTOCOL_TEL = 'tel:';
const PROTOCOL_MAILTO = 'mailto:';

export const LEGACY_LINK_ACCOUNT = '/account';
export const LEGACY_LINK_STOREFINDER = '/storefinder';
export const LEGACY_LINK_CHANNEL = '/channel';
export const LEGACY_LINK_ORDERS = '/orders_legacy';
export const LEGACY_LINK_CHECKOUT = '/checkout_legacy';
export const LEGACY_LINK_REGISTER = '/register_legacy';
export const LEGACY_LINK_REGISTER_GUEST = '/register_legacy_guest';
export const LEGACY_LINK_CONNECT_REGISTER = '/connect_register';

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
  LEGACY_LINK_CHECKOUT,
  LEGACY_LINK_REGISTER,
  LEGACY_LINK_REGISTER_GUEST,
  LEGACY_LINK_CONNECT_REGISTER,
];

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
export const isLegacyLink = location => !!legacyLinks.find(link => location.startsWith(link));

/**
 * Checks whether it is a shop link.
 * @param {string} location The location to open.
 * @return {boolean}
 */
export const isShopLink = (location) => {
  if (!appConfig.shopCNAME) {
    return false;
  }

  // Check for a non-absolute link.
  if (!location.startsWith(PROTOCOL_HTTPS) && !location.startsWith(PROTOCOL_HTTP)) {
    return false;
  }

  // Dissect the hostname form the given location.
  let hostname;
  try {
    ({ hostname } = new URL(location));
  } catch (e) {
    return false;
  }

  // Check for an exact match against the shop CNAME.
  if (hostname === appConfig.shopCNAME.toLowerCase()) {
    return true;
  }

  // Check that the hostname contains a Shopgate domain.
  if (!hostname.endsWith(SHOPGATE_DOMAIN || !hostname.endsWith(SHOPGATEPG_DOMAIN))) {
    return false;
  }

  // Lastly, check explicitly for Shopgate domains.
  if (SHOPGATE_DOMAINS.includes(hostname)) {
    return false;
  }

  return true;
};

/**
 * Sanitizes a link.
 * @param {string} location The location to sanitize.
 * @return {string}
 */
export const sanitizeLink = (location) => {
  let sanitized = location;

  // Remove trailing slashes from the location.
  if (sanitized && sanitized.length > 1) {
    const parts = sanitized.split('?');

    if (parts[0].endsWith('/')) {
      parts[0] = parts[0].slice(0, -1);
    }

    sanitized = parts.join('?');
  }

  return sanitized;
};

/**
 * Takes care that protector routes are removed from the history stack when a user is redirected
 * to a protected route after a successful login.
 * Usually those routes are replaced with the protected route, but at redirects to a legacy app page
 * or the in-app-browser they need to be removed from history.
 * @param {string} historyAction The history action which was used to navigate.
 * @param {Object} state The application state.
 */
export const handleAppRedirect = (historyAction, state) => {
  const { pathname } = getCurrentRoute(state);

  if (authRoutes.isProtector(pathname) && historyAction === ACTION_REPLACE) {
    /**
     * A replace action on a protector route indicates that the authentication was successful.
     * So the protector route can be popped from the history stack.
     */
    router.pop();
  }
};

/**
 * Opens a link in the in-app-browser.
 * @param {string} location The location to open.
 * @param {string} historyAction The history action which was used to open the link.
 * @param {Object} state The application state.
 * @param {Object} locationState state params for location
 */
export const openExternalLink = (location, historyAction, state, locationState = {}) => {
  const { target } = locationState;

  if (!hasSGJavaScriptBridge()) {
    window.open(location, '_blank');
    handleAppRedirect(historyAction, state);
    return;
  }

  if (target === '_blank') {
    // Deeplinks to social apps: fb, whatsapp, etc. Treat as native links
    openPageExtern({
      src: location,
    });
    return;
  }

  showTab({
    targetTab: 'in_app_browser',
    animation: 'slideInFromBottom',
  });

  openPage({
    src: location,
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

  handleAppRedirect(historyAction, state);
};

/**
 * Opens an legacy link in the old system in the given targetTab.
 * @param {Object} options Options of the link.
 * @param {string} options.location Link url.
 * @param {string} options.targetTab Target tab where the page should be opened.
 * @param {string} options.navigationType Type of the navigation bar that should be displayed.
 * @param {Function} options.backCallback Function that is executed when hitting the back button.
 * @param {string} options.historyAction The history action which was used to open the link.
 * @param {Object} state The application state.
 */
export const handleLegacyLink = (options, state) => {
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

    handleAppRedirect(options.historyAction, state);
  }
};

/**
 * Opens a legacy CMS page.
 * @param {string} location The location to open.
 * @param {string} historyAction The history action which was used to open the link.
 * @param {Object} state The application state.
 */
export const openLegacy = (location, historyAction, state) => {
  handleLegacyLink({
    targetTab: 'main',
    location,
    historyAction,
  }, state);
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
 * @param {string} historyAction The history action which was used to open the link.
 * @param {Object} state The application state.
 */
export const openLegacyLink = (location, historyAction, state) => {
  // Remove route parameters and query parameters to get the pure route of the legacy link.
  const route = `/${location.split(/[?/]/)[1]}`;

  switch (route) {
    case LEGACY_LINK_ACCOUNT:
    case LEGACY_LINK_STOREFINDER:
    case LEGACY_LINK_CHANNEL:
      openLegacy(location, historyAction, state);
      break;
    case LEGACY_LINK_ORDERS:
      handleLegacyLink({
        targetTab: 'main',
        location: '/orders',
        historyAction,
      }, state);
      break;
    case LEGACY_LINK_CHECKOUT:
      handleLegacyLink({
        targetTab: 'cart',
        flushTab: 'cart',
        navigationType: 'checkout',
        location: '/checkout/default',
        backCallback: 'SGAction.popTabToRoot(); SGAction.showTab({ targetTab: "main" });',
        historyAction,
      }, state);
      break;
    case LEGACY_LINK_REGISTER:
      handleLegacyLink({
        targetTab: 'main',
        location: '/register/default',
        historyAction,
      }, state);
      break;
    case LEGACY_LINK_REGISTER_GUEST:
      handleLegacyLink({
        targetTab: 'main',
        location: '/register/guest',
        historyAction,
      });
      break;
    case LEGACY_LINK_CONNECT_REGISTER:
      handleLegacyLink({
        location: `/${LEGACY_LINK_CONNECT_REGISTER}`,
        targetTab: 'main',
        backCallback: 'SGAction.popTabToRoot(); SGAction.showTab({ targetTab: "main" });',
        historyAction,
      }, state);
      break;
    default:
      logger.warn(`openLegacyLink not handled: ${location}`);
      break;
  }
};
