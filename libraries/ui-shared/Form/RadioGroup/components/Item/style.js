import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const input = css({
  display: 'none',
}).toString();

const container = css({
  display: 'flex',
}).toString();

const label = css({
  flex: 1,
  fontSize: '1rem',
  lineHeight: 1.1,
  marginLeft: themeConfig.variables.gap.small,
  marginBottom: themeConfig.variables.gap.small,
}).toString();

const active = css({
  color: themeConfig.colors.primary,
}).toString();

export default {
  input,
  container,
  label,
  active,
};
