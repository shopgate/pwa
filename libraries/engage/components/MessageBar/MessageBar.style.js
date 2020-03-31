import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

const containerBase = {
  background: themeColors.background,
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  overflow: 'hidden',
};

export const container = css(containerBase).toString();

export const containerRaised = css(containerBase, {
  borderRadius: '0 0 5px 5px',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  zIndex: 10,
}).toString();

const messageBase = {
  padding: `${themeVariables.gap.big}px ${themeVariables.gap.big}px`,
  fontSize: '0.875rem',
  lineHeight: 1.3,
  fontWeight: 500,
  ':not(:last-child)': {
    marginBottom: themeVariables.gap.small * 0.5,
  },
};

export const info = css(messageBase, {
  background: themeColors.accent,
  color: themeColors.accentContrast,
}).toString();

export const error = css(messageBase, {
  background: themeColors.error,
  color: themeColors.light,
}).toString();

export const warning = css(messageBase, {
  background: themeColors.warning,
  color: themeColors.light,
}).toString();

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
}).toString();

export const icon = css({
  flexGrow: 0,
  flexShrink: 0,
}).toString();

export const messageToIcon = css({
  flexGrow: 1,
});
