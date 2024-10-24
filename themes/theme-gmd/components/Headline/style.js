import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { variables } = themeConfig;

export default css({
  fontSize: 18,
  padding: `${variables.gap.big}px 0 0`,
  marginTop: 0,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: 0,
    margin: `${variables.gap.big * 2}px 0 ${variables.gap.big}px`,
  },
  textAlign: 'center',
}).toString();
