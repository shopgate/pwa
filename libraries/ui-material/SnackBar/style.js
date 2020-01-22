import { css } from 'glamor';
import Color from 'color';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const backgroundColor = '#323232';
const buttonColor = themeConfig.colors.accent;
const buttonColorContrast = Color(buttonColor).contrast(Color(backgroundColor));
// Button color can be anything. Fall back to white if accent is too dark.
const safebuttonColor = buttonColorContrast > 4 ? buttonColor : '#fff';

const container = css({
  marginTop: 'calc((var(--snack-bar-height, 80px) * -1) - var(--footer-height))',
  position: 'relative',
  height: 'var(--snack-bar-height, 80px)',
  overflow: 'hidden',
  zIndex: 6,
});

const wrapper = css({
  top: 'var(--snack-bar-height, 80px)',
  display: 'flex',
  justifyContent: 'center',
  left: 0,
  position: 'absolute',
  width: '100%',
  zIndex: 6,
});

const box = css({
  alignItems: 'center',
  background: backgroundColor,
  borderRadius: 3,
  boxShadow: themeConfig.shadows.toast,
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
  color: safebuttonColor,
  fontWeight: 500,
  height: 36,
  letterSpacing: 'inherit',
  margin: '0 -8px 0 8px',
  outline: 0,
  padding: '0 8px',
  textTransform: 'uppercase',
});

export default {
  container,
  wrapper,
  box,
  label,
  button,
};
