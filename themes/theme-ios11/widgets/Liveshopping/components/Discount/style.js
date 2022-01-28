import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export default css({
  fontWeight: 500,
  marginBottom: variables.gap.small,
  width: 'auto',
  '@media(max-width: 480px)': {

  },
}).toString();
