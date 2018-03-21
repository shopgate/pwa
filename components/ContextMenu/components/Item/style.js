import { css } from 'glamor';
import variables from 'Styles/variables';

const item = css({
  position: 'relative',
  whiteSpace: 'nowrap',
  padding: `${variables.gap.big * 0.875}px ${variables.gap.big * 1.375}px`,
  lineHeight: 1,
  zIndex: 1,
}).toString();

export default { item };
