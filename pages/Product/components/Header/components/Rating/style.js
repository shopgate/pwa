import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const container = css({
  display: 'flex',
  alignItems: 'center',
  lineHeight: '12px',
  marginBottom: variables.gap.small,
}).toString();

export { container };
