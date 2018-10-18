import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const wrapper = css({
  top: 'var(--safe-area-inset-top)',
  display: 'flex',
  justifyContent: 'center',
  left: 0,
  position: 'fixed',
  transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  width: '100%',
  willChange: 'transform',
  zIndex: 51,
});

const box = css({
  alignItems: 'center',
  background: 'rgba(248, 248, 248, 0.75)',
  backdropFilter: 'blur(10px)',
  borderRadius: 13,
  boxShadow: '0 1px 16px rgba(0, 0, 0, 0.12)',
  display: 'flex',
  fontSize: '0.882rem',
  justifyContent: 'space-between',
  margin: '16px 8px',
  minHeight: 48,
  padding: '6px 16px',
  width: '100%',
});

const label = css({
  lineHeight: 1.4,
  margin: '6px 0',
  overflow: 'hidden',
}).toString();

const button = css({
  color: themeConfig.colors.accent,
  fontWeight: 500,
  height: 36,
  letterSpacing: 'inherit',
  margin: '0 -8px 0 8px',
  outline: 0,
  padding: '0 8px',
});

export default {
  wrapper,
  box,
  label,
  button,
};
