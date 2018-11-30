import { css } from 'glamor';
import color from 'color';
import colors from 'Styles/colors';
import { DRAWER_BACKGROUND } from '../../constants';

const textColorContrast = color(colors.accent).contrast(color(DRAWER_BACKGROUND));

export default css({
  color: textColorContrast > 4 ? colors.accent : 'white',
  fontWeight: 500,
  flexGrow: 1,
  textTransform: 'uppercase',
  textAlign: 'right',
  padding: '7px 0',
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
  ':focus': {
    outline: 'none',
  },
});
