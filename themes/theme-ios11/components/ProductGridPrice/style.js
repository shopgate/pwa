import { css } from 'glamor';

const priceWrapper = css({
  lineHeight: 1.75,
  marginTop: 2,
  alignItems: 'center',
}).toString();

const basicPrice = css({
  fontSize: '0.85em',
  marginTop: -1,
}).toString();

const strikedPrice = css({
  fontSize: '0.75rem',
}).toString();

export default {
  basicPrice,
  priceWrapper,
  strikedPrice,
};
