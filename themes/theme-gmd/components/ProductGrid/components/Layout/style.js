import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export default css({
  background: `var(--page-background-color, '${colors.background}')`,
  [responsiveMediaQuery('<=xs')]: {
    ':not(:empty)': {
      paddingBottom: 2,
    },
  },
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: variables.gap.big,
  },
}).toString();
