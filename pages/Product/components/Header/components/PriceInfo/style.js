import { css } from 'glamor';

const placeholder = css({
  height: 20,
  width: '50px',
  display: 'inline-block',
}).toString();

const priceInfo = css({
  fontSize: 12,
  marginTop: 4,
}).toString();

export default {
  placeholder,
  priceInfo,
};
