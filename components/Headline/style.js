import { css } from 'glamor';
import variables from 'Styles/variables';

const headline = css({
  fontSize: 18,
  margin: `${variables.gap.big * 2}px 0 ${variables.gap.big}px`,
  textAlign: 'center',
}).toString();

export default {
  headline,
};
