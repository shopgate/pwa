import { css } from 'glamor';

const container = css({

});

const wrapper = css({
  transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
}).toString();

export default {
  container,
  wrapper,
};
