const materialShadow = 'rgba(0, 0, 0, .117647) 0 1px 6px, rgba(0, 0, 0, .117647) 0 1px 4px';
const colors = {
  background: '#f8f8f8',
  light: '#fff',
  dark: '#000',
  accent: '#007AFF',
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

module.exports = {
  font: {
    family: 'system, -apple-system, "SF Pro Display", "Helvetica Neue", "Lucida Grande"',
    rootSize: 17,
    lineHeight: 1.43,
  },
  colors,
  // WARNING: if this is extended, you need to adjust style/variables.js as well.
  variables: {
    materialShadow,
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
      height: 44,
    },
    navigator: {
      height: 44,
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
      color: colors.shade3,
    },
  },
};
