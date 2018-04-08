import { css } from 'glamor';
import colors from 'Styles/colors';

export default css({
  background: colors.background,
  flexGrow: 1,
  paddingTop: 4,
  paddingBottom: [
    '4px',
    'calc(4px + var(--safe-area-inset-bottom))',
  ],
}).toString();
