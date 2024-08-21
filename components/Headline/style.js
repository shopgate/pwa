import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export default css({
  fontSize: 18,
  margin: `${variables.gap.big * 2}px 0 ${variables.gap.big}px`,
  textAlign: 'center',
}).toString();
