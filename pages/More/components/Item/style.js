import { css } from 'glamor';
import colors from 'Styles/colors';

export default css({
  '&:first-child': {
    boxShadow: `0 -1px 0 0 ${colors.darkGray}, 0 1px 0 0 ${colors.darkGray}`,
  },
  boxShadow: `0 1px 0 0 ${colors.darkGray}`,
  padding: '12px 0',
  'button&': {
    outline: 0,
    textAlign: 'inherit',
    width: '100%',
  },
}).toString();
