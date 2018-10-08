import { css } from 'glamor';

const price = css({
  fontSize: '1rem',
  fontWeight: 500,
  justifyContent: 'flex-end',
  textAlign: 'right',
}).toString();

const priceStriked = css({
  fontSize: '.875rem',
  textAlign: 'right',
}).toString();

export default {
  price,
  priceStriked,
};
