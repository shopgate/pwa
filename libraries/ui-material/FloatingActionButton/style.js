import { css } from 'glamor';

const button = css({
  borderRadius: '50%',
  outline: 0,
  overflow: 'hidden',
  padding: 0,
  position: 'relative',
  zIndex: 1,
}).toString();

const buttonSmall = css({
  height: 40,
  width: 40,
});

const buttonLarge = css({
  height: 56,
  width: 56,
});

const buttonShadow = css({
  boxShadow: '0 8px 13px rgba(0, 0, 0, 0.25)',
});

export default {
  button,
  buttonSmall,
  buttonLarge,
  buttonShadow,
};
