import { css } from 'glamor';
import { updatePageBackgroundColor } from 'Components/Viewport/style';

/**
 * @param {string} color The new page background color.
 */
export const setBackgroundColor = (color) => {
  updatePageBackgroundColor(color);
};

export default css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
});
