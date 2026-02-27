/**
 * Creates a function that generates a CSS selector string for a given color scheme,
 * based on the specified selector type (either 'data' for data attributes or
 * 'class' for class names).
 *
 * @param {'data' | 'class'} selectorType The type of selector to be used,
 * either 'data' for data attributes or 'class' for class names.
 * @returns {Function}
 */
export function createGetColorSchemeSelector(selectorType) {
  return (colorScheme) => {
    if (selectorType === 'data') {
      return `[data-sg-color-scheme="${colorScheme}"]`;
    }

    return `.${colorScheme}`;
  };
}

/**
 * Creates a function that switches the color scheme, based on the specified selector type
 * (either 'data' for data attributes or 'class' for class names).
 *
 * @param {'data' | 'class'} selectorType The type of selector to be used,
 * either 'data' for data attributes or 'class' for class names.
 * @returns {Function}
 */
export function createSetActiveColorScheme(selectorType) {
  return (colorScheme) => {
    const root = document.documentElement;

    if (selectorType === 'data') {
      root.setAttribute('data-sg-color-scheme', colorScheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(colorScheme);
    }
  };
}
