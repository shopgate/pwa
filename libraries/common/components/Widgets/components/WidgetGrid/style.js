import { css } from 'glamor';

export default css({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridAutoRows: 'auto',
  gridAutoFlow: 'row dense',
  position: 'relative',
});
