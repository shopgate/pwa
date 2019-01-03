import { css } from 'glamor';
import variables from 'Styles/variables';

export default css({
  fontWeight: 500,
  marginBottom: variables.gap.small,
  width: 'auto',
  '@media(max-width: 480px)': {
    position: 'absolute',
    left: 10,
    top: 10,
  },
}).toString();
