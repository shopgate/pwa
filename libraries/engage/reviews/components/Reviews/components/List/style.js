import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export default css({
  marginLeft: variables.gap.big,
  padding: `${variables.gap.big}px ${variables.gap.big}px ${variables.gap.big}px 0`,
  borderTop: `1px solid ${colors.shade7}`,
}).toString();
