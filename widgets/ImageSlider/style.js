import { css } from 'glamor';

const wrapper = css({
  maxWidth: '100%',
  width: '100vw',
}).toString();

const link = css({
  width: '100%',
}).toString();

const image = css({
  display: 'block',
  width: '100%',
});

export default {
  link,
  image,
};
