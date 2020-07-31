import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { variables } = themeConfig;

export const headline = css({
  display: 'none',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 'normal',
    paddingBottom: variables.gap.big,
    padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
  },
});
