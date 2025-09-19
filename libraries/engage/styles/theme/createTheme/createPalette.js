const grey = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#f5f5f5',
  A200: '#eeeeee',
  A400: '#bdbdbd',
  A700: '#616161',
};

/**
 * Creates a palette object for the theme.
 * @returns {Object} The palette object.
 */
const createPalette = () => {
  const palette = {
    primary: {
      main: 'var(--color-primary)',
      contrast: 'var(--color-primary-contrast)',
    },
    secondary: {
      main: 'var(--color-secondary)',
      contrast: 'var(--color-secondary-contrast)',
    },
    error: {
      main: 'var(--color-state-alert)',
    },
    warning: {
      main: 'var(--color-state-warning)',
    },
    success: {
      main: 'var(--color-state-ok)',
    },
    cta: {
      main: 'var(--color-button-cta)',
      contrast: 'var(--color-button-cta-contrast)',
    },
    text: {
      primary: 'var(--color-text-high-emphasis)',
      secondary: 'var(--color-text-medium-emphasis)',
      tertiary: 'var(--color-text-low-emphasis)',
    },
  };

  return {
    ...palette,
    grey,
  };
};

export default createPalette;
