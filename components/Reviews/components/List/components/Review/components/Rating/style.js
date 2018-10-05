import { css } from 'glamor';

const container = css({
  display: 'flex',
  alignItems: 'center',
}).toString();

const stars = css({
  display: 'inline-block',
  lineHeight: 'initial',
}).toString();

export default {
  container,
  stars,
};
