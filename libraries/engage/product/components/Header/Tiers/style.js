import { css } from 'glamor';

const wrapper = css({
  marginTop: 4,
  fontSize: '0.875rem',
}).toString();

const tier = css({
  display: 'block',
  lineHeight: 1.35,
}).toString();

const price = css({
  fontWeight: 500,
}).toString();

export default {
  price,
  tier,
  wrapper,
};
