import { css } from 'glamor';
import colors from 'Styles/colors';

const actionButton = css({
  color: colors.primary,
  flexGrow: 1,
  textTransform: 'uppercase',
  textAlign: 'right',
  padding: '7px 0',
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
  ':focus': {
    outline: 'none',
  },
}).toString();

export default {
  actionButton,
};
