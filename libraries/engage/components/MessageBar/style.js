import { css } from 'glamor';
// TODO: Remove the usage of themeConfig here
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  background: themeConfig.colors.background,
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
});

const messageBase = {
  padding: `${themeConfig.variables.gap.small}px ${themeConfig.variables.gap.big}px`,
  fontSize: '0.875rem',
  fontWeight: 500,
  ':not(:last-child)': {
    marginBottom: themeConfig.variables.gap.small * 0.5,
  },
};

const info = css(messageBase, {
  background: themeConfig.colors.accent,
  color: themeConfig.colors.accentContrast,
});

const error = css(messageBase, {
  background: themeConfig.colors.error,
  color: themeConfig.colors.light,
});

const warning = css(messageBase, {
  background: themeConfig.colors.warning,
  color: themeConfig.colors.light,
});

const srOnly = css({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export default {
  container,
  info,
  error,
  warning,
  srOnly,
};
