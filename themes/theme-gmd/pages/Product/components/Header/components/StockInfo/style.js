import { css } from 'glamor';

const placeholder = css({
  height: 16,
  width: '70%',
  marginTop: 5,
  marginBottom: 2,
}).toString();

const availability = css({
  fontSize: '0.875rem',
}).toString();

export default {
  placeholder,
  availability,
};
