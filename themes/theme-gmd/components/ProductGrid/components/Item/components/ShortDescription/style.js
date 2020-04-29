import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const wrapper = css({
  display: 'none',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    display: 'block',
    color: colors.shade6,
  },
});
