const materialShadow = 'rgba(0, 0, 0, .117647) 0 1px 6px, rgba(0, 0, 0, .117647) 0 1px 4px';
const colors =  {
  background: '#f8f8f8',
  light: '#fff',
  dark: '#000',
  accent: '#00c3e6',
  placeholder: '#f2f2f2',
  dividers: '#cecece',
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
  shade12: '#8a8a8f',
  success: '#35cc29',
  warning: '#ff9300',
  error: '#ff0000',
};

// WARNING: if this is extended, you need to adjust style/variables.js as well.
module.exports = {
  font: {
    family: 'system, -apple-system, "SF Pro Display", "Helvetica Neue", "Lucida Grande"',
    rootSize: 17,
    lineHeight: 1.43,
  },
  colors,
  variables: {
    materialShadow,
    blur: {
      backdropFilter: 'blur(10px)',
    },
    gap: {
      small: 8,
      big: 16,
      bigger: 20,
      xbig: 32,
      xxbig: 64,
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
    statusBar: {
      height: 20,
    },
    buttonBase: {
      borderRadius: 5,
      fontWeight: 700,
      fontSize: 16,
      padding: '0 0 3px',
      textAlign: 'center',
    },
    discountBadgeBase: {
      borderRadius: 2,
      fontSize: '0.7rem',
    },
    priceStrikedBase: {
      color: colors.shade12,
      lineHeight: 1,
      fontSize: 12,
    },
  },
};
