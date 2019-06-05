import pck from './../../package';
import { buildThemeConfig } from './theme';
import { assignObjectDeep } from '../data';

/**
 * Provides a default app config as a fallback.
 * @type {Object}
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

// Fix references
assignObjectDeep(themeConfig, appConfig.theme);
appConfig.theme = themeConfig;

/**
 * Takes an object with app config values and safely injects it into the current app config.
 * @param {Object} newConfig Contains new config fields to inject into the existing destination.
 */
export function writeToConfig(newConfig) {
  assignObjectDeep(appConfig, newConfig, true, false);
}

/**
 * The shop number.
 * @typedef {string}
 */
const { appId } = appConfig;
export const shopNumber = appId ? appId.replace('shop_', '') : '';

export default appConfig;
