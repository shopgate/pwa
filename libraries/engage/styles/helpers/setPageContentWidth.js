import { setCSSCustomProp } from './cssCustomProperties';

/**
 * Updates the page background color.
 * @param {number} width Sets the page content width.
 * @param {string} [unit='px'] Optional width unit
 */
export const setPageContentWidth = (width, unit = 'px') => {
  setCSSCustomProp('--page-content-width', `${width}${unit}`);
};
