import { setCSSCustomProp } from './cssCustomProperties';

/**
 * Updates the page background color.
 * @param {number} width Sets the page content width.
 */
export const setPageContentWidth = (width) => {
  setCSSCustomProp('--page-content-width', `${width}px`);
};
