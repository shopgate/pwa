import { css } from 'glamor';
import Color from 'color';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const backgroundColor = '#323232';
const buttonColor = themeConfig.colors.accent;
const buttonColorContrast = Color(buttonColor).contrast(Color(backgroundColor));
// Button color can be anything. Fall back to white if accent is too dark.
const safebuttonColor = buttonColorContrast > 4 ? buttonColor : '#fff';

const container = css({
  marginTop: 'calc(-80px - var(--footer-height))',
  position: 'relative',
  height: 80,
  overflow: 'hidden',
  zIndex: 6,
});

const wrapper = css({
  top: 80,
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
