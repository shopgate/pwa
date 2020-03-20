import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

export const container = css({
  background: themeColors.light,
  padding: '0 12px 8px 12px',
});

export const queryLine = css({
  background: themeColors.shade7,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const input = css({
  margin: '3px 0',
  width: '100%',
  lineHeight: '28px',
  outline: 'none',
  verticalAlign: 'middle',
  WebkitAppearance: 'none',
});

export const icon = css({
  padding: 0,
  margin: '0 8px',
  color: '#8a8a8f',
  fontSize: '1.23rem',
  flexShrink: 0,
  outline: 0,
});

export const country = css({
  width: '25%',
  paddingLeft: themeVariables.gap.small,
});

export const select = css({
  border: `1px solid ${themeColors.shade7}`,
  color: themeColors.shade3,
  fontSize: '0.725rem',
  borderRadius: 5,
  height: '100%',
  width: '100%',
  outline: 0,
});

export const progressBar = css({
  position: 'relative',
});

export const iconClass = css({
  fontSize: '1.25rem !important',
});

export const messageClass = css({
  textAlign: 'center',
});
