import pck from './../../package';
import { buildThemeConfig } from './theme';
import { assignObjectDeep } from '../data';
import { isObject } from '../validation';

/**
 * Provides a default app config as a fallback.
 * @typedef {Object} AppConfig
 */
const defaultAppConfig = {
  appId: 'shop_30177',
  browserConnector: false,
  colors: {},
  forgotPasswordUrl: null,
  hasFavorites: false,
  hasReviews: true,
  showWriteReview: true,
  language: 'en-us',
  logo: 'https://example.com/logo',
  marketId: 'US',
  publicPath: 'https://example.com/public',
  shopName: 'Shopgate Connect',
  webCheckoutShopify: null,
  hasNoScanner: false,
  apiUrl: 'https://shop_30177.dev.connect.shopgate.com/',
  shopCNAME: null,
  currency: 'USD',
  showGmdMenuSubHeaders: false,
  benchmark: false,
  sentry: {},
  theme: {},
  cartShippingHideAnonymousLegacy: null,
  cartShippingTextAnonymousLegacy: null,
  cart: {},
  scanner: {},
  favorites: {},
  tracking: {
    hasWebTrackingEngage: false,
  },
  webTrackingEngage: {
    android: '',
    ios: '',
    events: [],
  },
};

/**
 * @type {string} package version from package.json
 */
export const pckVersion = pck.version;

/**
 * Provides a default components config as a fallback.
 * @type {{portals: {}, widgets: {}}}
 */
const defaultComponentsConfig = {
  portals: {},
  widgets: {},
};

/**
 * The components.json config from the theme.
 * @typedef {Object}
 */
export const componentsConfig = {
  ...defaultComponentsConfig,
  ...process.env.COMPONENTS_CONFIG,
};

/**
 * The app.json config from the theme which will automatically be resolved.
 * Be careful when changing existing properties on the fly, reassignments should never be done!
 * @typedef {Object}
 */
const appConfig = process.env.NODE_ENV !== 'test' ? process.env.APP_CONFIG : defaultAppConfig;

/**
 * The theme name.
 * @typedef {string}
 */
export const themeName = process.env.THEME || 'theme';

/**
 * The resolved theme configuration.
 * @typedef {Object}
 */
export const themeConfig = buildThemeConfig(appConfig);

// Fix theme config reference
appConfig.theme = themeConfig;

/**
 * A comparator for array items as they occur on different levels within the default app config.
 * It identifies items uniquely to avoid duplicates when merging configs.
 * Items identified as equal are merged together by the caller. Non-equals are added to the result.
 *
 * @type {ArrayItemComparator} Callback implementation for "assignObjectDeep"
 * @param {string} path Allows identification of the current elements to be compared
 * @param {*} prev Item that already exists in the config.
 * @param {*} next Item to be compared against.
 * @returns {boolean}
 */
export const appConfigArrayItemComparator = (path, prev, next) => {
  // Replaces object paths with array indices to a structure with easy comparisons
  // E.g. converts "prop.subprop.15.arrayitem.3" to "prop.subprop.N.arrayitem.N"
  const simplePath = path.replace(/\.[0-9]+/g, '.N');

  // Simple types
  if (!isObject(prev) || !isObject(next)) {
    return prev === next;
  }

  // Identity of pages is defined by the page pattern
  if (simplePath === '$.theme.pages.N') {
    return prev.pattern === next.pattern;
  }

  // Identity of widgets is defined by the widget id
  if (simplePath === '$.theme.pages.N.widgets.N') {
    return prev.id === next.id;
  }

  // Assume everything else to be of different values (including sub-arrays)
  // => Arrays within arrays not defined in the default config => never equal.
  // => Custom defined array items must be handled using the given arrayComparator!
  return false;
};

/**
 * Takes an object with app config values and safely injects it into the current app config.
 * @param {Object} newConfig Contains new config fields to inject into the existing destination.
 * @param {ArrayItemComparator|null} [arrayComparator] Defines how to compare array items.
 */
export function writeToConfig(newConfig, arrayComparator = null) {
  const comparator = arrayComparator || appConfigArrayItemComparator;
  assignObjectDeep(appConfig, newConfig, true, comparator, '$');
}

/**
 * The shop number.
 * @typedef {string}
 */
const { appId } = appConfig;
export const shopNumber = appId ? appId.replace('shop_', '') : '';

/** @type {AppConfig} */
export default appConfig;
