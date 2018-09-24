import { css } from 'glamor';

const priceWrapper = css({
  alignItems: 'center',
  lineHeight: 1.8,
  marginTop: 2,
}).toString();

const basicPrice = css({
  fontSize: '0.85em',
  marginTop: -1,
}).toString();

export default {
  basicPrice,
  priceWrapper,
};
