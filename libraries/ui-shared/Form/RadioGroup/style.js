import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  paddingTop: themeConfig.variables.gap.big * 1.5,
  display: 'flex',
  flexDirection: 'column',
}).toString();

const label = css({
  fontSize: '0.8rem',
  paddingBottom: themeConfig.variables.gap.small,
  color: themeConfig.colors.shade12,
}).toString();

export default {
  container,
  label,
};
