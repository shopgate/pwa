import { css } from 'glamor';
import variables from 'Styles/variables';
/**
 * The styles for the container element.
 */
const container = {
  input: css({
    position: 'relative',
    paddingBottom: variables.gap.big,
    width: '100%',
  }).toString(),
  multiLine: css({
    position: 'relative',
    width: '100%',
  }).toString(),
};

export default {
  container,
};
