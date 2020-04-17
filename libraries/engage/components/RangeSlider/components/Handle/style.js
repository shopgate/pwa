import { css } from 'glamor';

export default css({
  top: '50%',
  position: 'absolute',
  cursor: 'pointer',
  ':first-child': {
    left: 0,
    transform: 'translate(-50%, -50%)',
  },

  ':last-child': {
    left: 'auto',
    right: 0,
    transform: 'translate(50%, -50%)',
  },
}).toString();
