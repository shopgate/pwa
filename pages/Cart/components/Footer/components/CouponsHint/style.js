import { css } from 'glamor';
import variables from 'Styles/variables';
import colors from 'Styles/colors';

export default css({
  ' + span': {
    paddingTop: 0,
  },
  background: colors.background,
  display: 'block',
  fontSize: 12,
  padding: `20px ${variables.gap.big}px`,
  textAlign: 'left',
}).toString();
