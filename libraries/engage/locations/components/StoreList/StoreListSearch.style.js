import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const container = css({
  background: colors.light,
  padding: '0 12px 8px 12px',
});

export const search = css({
  background: colors.shade7,
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

export const progressBar = css({
  position: 'relative',
});

