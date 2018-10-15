import { css } from 'glamor';
import variables from 'Styles/variables';

const headline = {
  fontWeight: 700,
  lineHeight: 1.17,
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
  display: 'inline-block',
};

const large = css({
  ...headline,
  fontSize: 34,
  margin: `${variables.gap.small}px 20px 20px`,
}).toString();

const small = css({
  ...headline,
  fontSize: 22,
  margin: `${variables.gap.big}px 20px 16px`,
}).toString();

export default {
  large,
  small,
};
