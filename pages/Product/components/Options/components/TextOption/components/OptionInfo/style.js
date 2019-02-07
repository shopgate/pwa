import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const info = css({
  marginTop: variables.gap.xsmall,
  padding: `0 ${variables.gap.big}px`,
}).toString();

const required = css({
  color: colors.shade9,
  fontSize: '0.825rem',
}).toString();

const price = css({
  textAlign: 'right',
  fontSize: '0.825rem',
}).toString();

export default {
  info,
  required,
  price,
};
