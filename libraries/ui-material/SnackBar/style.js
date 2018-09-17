import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const wrapper = css({
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  left: 0,
  position: 'fixed',
  transition: 'transform .25s cubic-bezier(0, 0, .2, 1)',
  width: '100%',
  willChange: 'transform',
  zIndex: 51,
});

const box = css({
  alignItems: 'center',
  background: '#323232',
  borderRadius: 3,
  boxShadow: '0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12)',
  color: '#fff',
  display: 'flex',
  fontSize: '0.875rem',
  justifyContent: 'space-between',
  letterSpacing: 0.5,
  margin: 16,
  maxWidth: 344,
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
  textTransform: 'uppercase',
});

export default {
  wrapper,
  box,
  label,
  button,
};
