import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export default css({
  display: 'flex',
  marginBottom: variables.gap.small,
  minHeight: 56,
}).toString();

