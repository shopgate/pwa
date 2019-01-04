import { css } from 'glamor';
import colors from 'Styles/colors';

export default css({
  background: colors.light,
  padding: '0 16px',
  ':not(:empty)': {
    marginTop: 16,
  },
}).toString();
