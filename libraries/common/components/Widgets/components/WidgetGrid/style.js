import { css } from 'glamor';

export default css({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridAutoRows: 'auto',
  gridAutoFlow: 'row dense',
}).toString();
