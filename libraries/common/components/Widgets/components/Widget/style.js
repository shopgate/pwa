import { css } from 'glamor';

/**
 * Creates a widget cell grid style.
 * @param {number} col Col index.
 * @param {number} row Row index.
 * @param {number} width Width.
 * @param {number} height Height.
 * @param {bool} visible Visible.
 * @returns {string}
 */
function widgetCell({
  col,
  row,
  width,
  height,
}) {
  return css({
    gridColumnStart: col + 1,
    gridColumnEnd: col + width + 1,
    gridRowStart: row + 1,
    gridRowEnd: row + height + 1,
  }).toString();
}

export default {
  widgetCell,
};
