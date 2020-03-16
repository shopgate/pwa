import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

export const container = css({
  background: themeColors.background,
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
});

export const messageBase = {
  padding: `${themeVariables.gap.small}px ${themeVariables.gap.big}px`,
  fontSize: '0.875rem',
  fontWeight: 500,
  ':not(:last-child)': {
    marginBottom: themeVariables.gap.small * 0.5,
  },
};

export const info = css(messageBase, {
  background: themeColors.accent,
  color: themeColors.accentContrast,
});

export const error = css(messageBase, {
  background: themeColors.error,
  color: themeColors.light,
});

export const warning = css(messageBase, {
  background: themeColors.warning,
  color: themeColors.light,
});

export const srOnly = css({
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

export const withIcon = css({
  display: 'flex',
  minWidth: '100%',
  alignItems: 'center',
});

export const icon = css({
  flexGrow: 0,
  flexShrink: 0,
});
export const messageToIcon = css({
  flexGrow: 1,
});
