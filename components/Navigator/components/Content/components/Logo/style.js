import { css } from 'glamor';
import variables from 'Styles/variables';

export default css({
  margin: '0 auto',
  maxHeight: '100%',
  maxWidth: `calc(100vw - ${(variables.navigator.height * 2) + variables.gap.xbig}px)`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
