import pck from '../../package';
import { buildThemeConfig } from './theme';
import { assignObjectDeep } from '../data';
import { isObject } from '../validation';

/**
 * Provides a default app config as a fallback.
 * @mixin AppConfig
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
  variantSelectionMode: null,
  product: {
    variantPreselect: false,
  },
  cart: {},
  scanner: {},
  favorites: {},
  tracking: {
    hasWebTrackingEngage: false,
  },
  webTrackingEngage: {
    android: '',
    ios: '',
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
 * @type {Object}
 */
export const componentsConfig = {
  ...defaultComponentsConfig,
  ...process.env.COMPONENTS_CONFIG,
};

/**
 * The app.json config from the theme which will automatically be resolved.
 * Be careful when changing existing properties on the fly, reassignments should never be done!
 * @mixes AppConfig
 */
const appConfig = process.env.NODE_ENV !== 'test' ? process.env.APP_CONFIG : defaultAppConfig;

/**
 * The theme name.
 * @type {string}
 */
export const themeName = process.env.THEME || 'theme';

/**
 * The resolved theme configuration.
 * @type {ThemeConfig}
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
 * @returns {boolean} Returns true if the items are considered equal and false if not
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
 * Comparator which treats items to be equal arrays by the position of the item in the array.
 * @param {string} [path] Unused param
 * @param {*} [prev] Unused param
 * @param {*} [next] Unused param
 * @param {number} prevIndex Position of the prev item in the array which is currently compared
 * @param {number} nextIndex Position of the next item in the array which is currently compared
 * @returns {boolean} Returns true if the items are considered equal and false if not
 */
export const equalStructureComparator = (path, prev, next, prevIndex, nextIndex) =>
  prevIndex === nextIndex;

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
 * @type {string}
 */
const { appId } = appConfig;
export const shopNumber = appId ? appId.replace('shop_', '') : '';

/** @mixes AppConfig */
export default appConfig;
