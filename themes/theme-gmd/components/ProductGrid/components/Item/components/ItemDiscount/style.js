import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export default css({
  lineHeight: 1,
  position: 'absolute',
  left: 10,
  top: 10,
  width: 40,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    right: variables.gap.xsmall,
    left: 'inherit',
    top: variables.gap.xsmall,
  },
});
