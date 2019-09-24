import { css } from 'glamor';

export default css({
  top: '50%',
  position: 'absolute',

  ':first-child': {
    left: 0,
    transform: 'translate(-50%, -50%)',
  },

  ':last-child': {
    left: 'auto',
    right: 0,
    transform: 'translate(50%, -50%)',
  },
});
