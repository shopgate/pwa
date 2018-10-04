import { css } from 'glamor';

const priceWrapper = css({
  lineHeight: 1.75,
}).toString();

const basicPrice = css({
  fontSize: '0.85em',
  marginTop: -1,
}).toString();

export default {
  basicPrice,
  priceWrapper,
};
