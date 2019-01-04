import { css } from 'glamor';
import colors from 'Styles/colors';

export default css({
  background: colors.light,
  marginTop: 16,
  padding: '0 16px',
  ':empty': {
    marginTop: 0,
  },
}).toString();
