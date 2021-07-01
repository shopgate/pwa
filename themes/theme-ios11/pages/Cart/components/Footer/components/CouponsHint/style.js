import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

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
