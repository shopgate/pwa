import { css } from 'glamor';

export default css({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  // Prevents that content behind the backdrop is clickable
  pointerEvents: 'all',
  touchAction: 'none',
});
