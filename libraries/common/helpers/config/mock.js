/**
 * @typedef {Object} ThemeColors
 */
const colors = {
  background: '#f8f8f8',
  light: '#fff',
  dark: '#000',
  accent: '#5ccee3',
  placeholder: '#f2f2f2',
  primary: '#fa5400',
  darkGray: '#eaeaea',
  shade3: '#9a9a9a',
  shade4: '#b5b5b5',
  shade5: '#ccc',
  shade6: '#656565',
  shade7: '#eaeaea',
  shade8: '#f7f7f7',
  shade9: '#8d8d8d',
  shade10: '#f4f4f4',
  shade11: '#747474',
  shade12: '#939393',
  success: '#35cc29',
  warning: '#ff9300',
  error: '#ff0000',
};

/**
 * @typedef {Object} ThemeShadows
 */
const shadows = {
  material: '0 1px 6px rgba(0, 0, 0, .117647), 0 1px 4px rgba(0, 0, 0, .117647)',
  navDrawer: '0 0 15px rgba(0, 0, 0, .24)',
  widget: '0 4px 8px rgba(0, 0, 0, 0.16)',
  productCard: '0 4px 8px rgba(0, 0, 0, 0.16)',
  productImage: 'inset 0 0 20px rgba(0, 0, 0, .05)',
  appBar: {
    cartBadge: '0 1px 1px rgba(0, 0, 0, 0.25)',
  },
  tabBar: '0 -1px 0 0 rgba(0, 0, 0, 0.1)',
  filter: {
    sort: 'rgba(0, 0, 0, 0.16) 0 2px 2px',
    priceSlider: '0 0 8px rgba(0, 0, 0, .16)',
  },
  cart: {
    paymentBar: '0 -4px 5px -2px rgba(0, 0, 0, 0.1)',
  },
  dialog: '0 0.75em 3em 0 rgba(0, 0, 0, 0.5)',
  toast: '0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12)',
  contextMenu: '0 2px 6px rgba(0, 0, 0, .4)',
  buttons: {
    disabled: '0 3px 4px rgba(0, 0, 0, 0.13)',
    elevated: '0 8px 13px rgba(0, 0, 0, 0.25)',
  },
  scannerBar: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  sheet: '0 -2px 4px rgba(0, 0, 0, 0.1)',
};

/**
 *
 * @typedef {Object} ThemeVariables
 */
const variables = {
  materialShadow: shadows.material,
  gap: {
    xsmall: 4,
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
  toast: {
    duration: 5000,
  },
  navigator: {
    height: 56,
    shadow: shadows.material,
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
  buttonBase: {
    borderRadius: 2,
    fontWeight: 500,
    fontSize: 17,
    padding: 0,
    textTransform: 'uppercase',
  },
  discountBadgeBase: {
    borderRadius: 2,
    fontSize: '0.75rem',
  },
  priceStrikedBase: {
    color: colors.shade3,
  },
  productSliderWidget: {
    borderRadius: 11,
    boxShadow: shadows.widget,
  },
  liveshoppingWidget: {
    borderRadius: 11,
    boxShadow: shadows.widget,
  },
};

/**
 * @typedef {Object} ThemeConfig
 * @property {ThemeColors} colors
 * @property {ThemeShadows} shadows
 * @property {ThemeVariables} variables
 */
export const themeConfig = {
  typography: {
    family: 'Roboto, Arial, sans-serif',
    rootSize: 16,
    lineHeight: 1.5,
  },
  colors,
  shadows,
  variables,
};

//  Alias for jest hoisting
export const mockThemeConfig = themeConfig;

