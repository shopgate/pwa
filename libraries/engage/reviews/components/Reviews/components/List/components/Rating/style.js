import { css } from 'glamor';

const container = css({
  alignItems: 'center',
  display: 'flex',
  margin: '4px 0',
}).toString();

const stars = css({
  display: 'inline-block',
  lineHeight: 1,
}).toString();

export default {
  container,
  stars,
};
