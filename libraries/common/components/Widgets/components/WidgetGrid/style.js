import { css } from 'glamor';

export default css({
  position: 'relative',
  ':empty': {
    display: 'none',
  },
}).toString();
