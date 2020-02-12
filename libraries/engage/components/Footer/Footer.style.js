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
 * Update the footer height
 * @param {number} height height
 */
export const updateFooterHeight = (height) => {
  const inset = Number(style.getPropertyValue('--safe-area-inset-bottom').replace(/\D/g, ''));
  const footerHeight = `${inset + height}px`;
  if (style.getPropertyValue('--footer-height') !== footerHeight) {
    style.setProperty('--footer-height', footerHeight);
  }
};

export const footer = css({
  bottom: 0,
  flexShrink: 1,
  position: 'relative',
  zIndex: 1,
  ':after': {
    backgroundColor: 'var(--footer-inset-background-color, var(--page-background-color))',
    height: 'var(--safe-area-inset-bottom)',
    content: ' ',
    display: 'inherit',
    position: 'relative',
    zIndex: 15,
  },
});
