import { css } from 'glamor';
import variables from 'Styles/variables';
import colors from 'Styles/colors';

export default css({
  background: colors.background,
  display: 'block',
  fontSize: 12,
  margin: '20px 0 -10px',
  padding: `0 ${variables.gap.big}px`,
  textAlign: 'left',
}).toString();
