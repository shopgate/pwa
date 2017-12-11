import { css } from 'glamor';

export default css({
  ' img': {
    display: 'initial',
  },
  // Clearfix for floated widget content
  ':after': {
    clear: 'both',
    content: '.',
    display: 'block',
    visibility: 'hidden',
    height: 0,
  },
}).toString();
