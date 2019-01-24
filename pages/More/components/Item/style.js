import { css } from 'glamor';
import colors from 'Styles/colors';

// place a thick shadow at the top of the first child and a thin shadow otherwise
export default css({
  '&:first-child': {
    boxShadow: '0 0 0 0',
  },
  boxShadow: `0 -1px 0 0 ${colors.darkGray}`,
  padding: '12px 0',
  'button&': {
    outline: 0,
    textAlign: 'inherit',
    width: '100%',
  },
}).toString();
