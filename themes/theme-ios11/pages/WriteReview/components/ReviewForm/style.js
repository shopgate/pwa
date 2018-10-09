import { css } from 'glamor';
import variables from 'Styles/variables';

const container = css({
  margin: `${variables.gap.big}px`,
}).toString();

const ratingScale = css({
  marginBottom: variables.gap.big,
});

export default {
  container,
  ratingScale,
};
