import { css } from 'glamor';

const placeholder = css({
  height: 20,
  width: '50px',
  display: 'inline-block',
}).toString();

const price = css({
  fontSize: '1.25rem',
  justifyContent: 'flex-end',
  lineHeight: 1,
}).toString();

export default {
  placeholder,
  price,
};
