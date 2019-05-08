const appConfig = require('./config/app.json');

const { theme: { styles: { globals: { colors } = {} } = {} } = {} } = appConfig;
const {
  light, dark, primary, accent,
} = colors;

/**
 * Currently the SDK uses the theme-config to autogenerate some dynamic color properties like
 * primaryContrast or accentContrast. To avoid breaking of this system, the required colors
 * are taken from the app-config and injected here.
 */
module.exports = {
  colors: {
    primary,
    accent,
    light,
    dark,
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
    navigator: {
      height: 44,
      shadow: 'rgba(0, 0, 0, .117647) 0 1px 6px, rgba(0, 0, 0, .117647) 0 1px 4px',
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
    priceStrikedBase: {
      color: '#9a9a9a',
    },
  },
};
