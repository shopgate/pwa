import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  display: 'flex',
  flexDirection: 'column',
  background: themeConfig.colors.background,
}).toString();

const messageBase = {
  padding: `${themeConfig.variables.gap.small}px ${themeConfig.variables.gap.big}px`,
  fontSize: '0.875rem',
  fontWeight: 500,
  ':not(:last-child)': {
    marginBottom: themeConfig.variables.gap.small * 0.5,
  },
};

const info = css({
  ...messageBase,
  background: themeConfig.colors.accent,
  color: themeConfig.colors.accentContrast,
}).toString();

const error = css({
  ...messageBase,
  background: themeConfig.colors.error,
  color: themeConfig.colors.light,
}).toString();

const warning = css({
  ...messageBase,
  background: themeConfig.colors.warning,
  color: themeConfig.colors.light,
}).toString();

export default {
  container,
  info,
  error,
  warning,
};
