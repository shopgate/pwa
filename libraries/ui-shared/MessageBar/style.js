import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const container = css({
  background: colors.background,
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
}).toString();

const messageBase = {
  padding: `${variables.gap.small}px ${variables.gap.big}px`,
  fontSize: '0.875rem',
  fontWeight: 500,
  ':not(:last-child)': {
    marginBottom: variables.gap.small * 0.5,
  },
};

const info = css(messageBase, {
  background: `var(--color-secondary, ${colors.accent})`,
  color: `var(--color-secondary-contrast, ${colors.accentContrast})`,
}).toString();

const error = css(messageBase, {
  background: colors.error,
  color: colors.light,
}).toString();

const warning = css(messageBase, {
  background: colors.warning,
  color: colors.light,
}).toString();

export default {
  container,
  info,
  error,
  warning,
};
