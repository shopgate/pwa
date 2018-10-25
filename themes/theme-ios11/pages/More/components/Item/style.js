import { css } from 'glamor';
import colors from 'Styles/colors';

export default css({
  border: `solid ${colors.dividers}`,
  borderWidth: '0.5px 0 0',
  padding: '12px 0',
  ':last-child': {
    borderBottomWidth: '0.5px',
  },
  'button&': {
    outline: 0,
    textAlign: 'inherit',
    width: '100%',
  },
}).toString();
