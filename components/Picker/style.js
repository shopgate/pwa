import { css } from 'glamor';
import variables from 'Styles/variables';

export default css({
  display: 'flex',
  minHeight: 60,
  marginBottom: variables.gap.small,
  ':last-child': {
    marginBottom: variables.gap.big,
  },
}).toString();
