import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const list = css({
  borderBottom: `1px solid ${colors.shade7}`,
});

export const loadingIndicator = css({
  padding: 0,
  margin: 'auto',
}).toString();
