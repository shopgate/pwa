import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  background: colors.light,
}).toString();

const headline = css({
  fontSize: 18,
  padding: `${variables.gap.big}px 0 0`,
  marginTop: 0,
  textAlign: 'center',
}).toString();

export default {
  container,
  headline,
};
