import { css } from 'glamor';

const strikedPrice = css({
  fontSize: '0.6875rem',
  textAlign: 'right',
}).toString();

const price = css({
  textAlign: 'right',
  display: 'flex',
  alignContent: 'stretch',
}).toString();

const basePrice = css({
  fontSize: '0.6875rem',
  textAlign: 'right',
}).toString();

export default {
  strikedPrice,
  price,
  basePrice,
};
