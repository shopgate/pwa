import { css } from 'glamor';
import variables from 'Styles/variables';

const container = css({

});

const wrapper = css({
  transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
}).toString();

const shaded = css({
  boxShadow: variables.navigator.shadow,
}).toString();

export default {
  container,
  wrapper,
  shaded,
};
