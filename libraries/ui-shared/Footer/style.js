import { css } from 'glamor';

const { style } = document.documentElement;

/**
 * Updates the background color of the bottom inset.
 * @param {string} color The new background color
 */
export const updateInsetBackgroundColor = (color) => {
  if (style.getPropertyValue('--footer-inset-background-color') !== color) {
    style.setProperty('--footer-inset-background-color', color);
  }
};

/**
 * Checks if a bottom inset is set.
 * @returns {boolean}
 */
export const hasInset = () => {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom');

  if (value) {
    return value.replace('px', '') > 0;
  }

  return false;
};

export const footer = css({
  bottom: 0,
  flexShrink: 1,
  position: 'relative',
  zIndex: 1,
});

export const withInset = css({
  [`.${footer.toString()}:after`]: {
    backgroundColor: 'var(--footer-inset-background-color, var(--page-background-color))',
    height: 'var(--safe-area-inset-bottom)',
    content: ' ',
    display: 'inherit',
    position: 'relative',
    zIndex: 15,
  },
});
