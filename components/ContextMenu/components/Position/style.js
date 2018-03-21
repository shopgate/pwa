import { css } from 'glamor';
import variables from 'Styles/variables';

const outerGap = variables.gap.small;

const container = css({
  position: 'absolute',
  margin: outerGap,
}).toString();

export default {
  container,
  outerGap,
};
