import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export default css({
  ':not(:empty)': {
    paddingBottom: 2,
  },
  background: `var(--page-background-color, '${colors.background}')`,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: variables.gap.big,
  },
}).toString();
