import { css } from 'glamor';
import variables from 'Styles/variables';

export default css({
  display: 'block',
  padding: `${Math.round(variables.gap.big * 0.8)}px ${variables.gap.big}px`,
}).toString();
