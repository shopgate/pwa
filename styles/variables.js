import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const variables = (process.env.NODE_ENV !== 'test' && themeConfig && themeConfig.variables) ? themeConfig.variables : {};

const materialShadow = 'rgba(0, 0, 0, .117647) 0 1px 6px, rgba(0, 0, 0, .117647) 0 1px 4px';

// WARNING: if this is extended, you need to adjust ROOT/theme-config.js as well.
export default {
  materialShadow,
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
    height: 56,
  },
  navigator: {
    height: 56,
    shadow: materialShadow,
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
    default: 11
  },
  ...variables,
};
