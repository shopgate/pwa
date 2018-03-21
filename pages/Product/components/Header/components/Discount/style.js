import { css } from 'glamor';

const placeholder = css({
  height: 20,
  width: '50px',
  display: 'inline-block',
}).toString();

const discount = css({
  width: 40,
  display: 'inline-block',
}).toString();

export default {
  placeholder,
  discount,
};
