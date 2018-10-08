import { css } from 'glamor';
import variables from 'Styles/variables';

export default css({
  bottom: 0,
  left: 0,
  overflowY: 'scroll',
  position: 'fixed',
  right: 0,
  top: `calc(${variables.navigator.height}px + var(--safe-area-inset-top))`,
});
