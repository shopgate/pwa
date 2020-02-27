const appConfig = require('./config/app.json');

const { theme: { colors } = {} } = appConfig;
const {
  light, dark, primary, accent,
} = colors;

/**
 * Currently the SDK uses the theme-config to autogenerate some dynamic color properties like
 * primaryContrast or accentContrast. To avoid breaking of this system, the required colors
 * are taken from the app-config and injected here.
 */
/** @type {ThemeConfig} */
module.exports = {
  colors: {
    primary,
    accent,
    light,
    dark,
    /** Backward compatibility for newly added extension config values */
    darkTransparent: 'rgba(0,0,0, 0.4)',
    lightTransparent: 'rgba(255, 255, 255, 0.82)',
    lightDark: '#323232',
    overlay: '#fafafa',
    lightOverlay: '#fafafa',
    darkOverlay: '#f0f0f0',
    gray: '#747474',
  },
  variables: {
    blur: {
      backdropFilter: 'blur(20px)',
    },
    gap: {
      small: 8,
      big: 16,
      bigger: 20,
      xbig: 32,
      xxbig: 64,
    },
    emptyPage: {
      icon: 216,
      titleTopGap: 36,
      buttonVerticalGap: 24,
    },
    navbar: {
      height: 44,
    },
    toast: {
      duration: 5000,
    },
    navigator: {
      height: 44,
    },
    filterbar: {
      height: 48,
    },
    loadingIndicator: {
      size: 32,
      strokeWidth: 3,
    },
    paymentBar: {
      height: 78,
    },
    tabBar: {
      height: 49,
    },
    borderRadius: {
      default: 11,
    },
    buttonBase: {
      borderRadius: 5,
      fontWeight: 600,
      fontSize: 17,
      padding: '8px 16px',
    },
    discountBadgeBase: {
      borderRadius: 2,
      fontSize: '0.75rem',
    },
    /** @deprecated use ThemeColors.shade3 */
    priceStrikedBase: {
      color: '#9a9a9a',
    },
  },
};
