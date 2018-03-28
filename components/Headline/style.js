import { css } from 'glamor';
import variables from 'Styles/variables';

const headline = {
  display: '-webkit-box',
  fontWeight: 700,
  lineHeight: 1.17,
  overflow: 'hidden',
  wordBreak: 'break-all',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
};

const large = css({
  ...headline,
  fontSize: 34,
  margin: `${variables.gap.small}px 20px 20px`,
}).toString();

const small = css({
  ...headline,
  fontSize: 22,
  margin: '26px 20px 16px',
}).toString();

export default {
  large,
  small,
};
