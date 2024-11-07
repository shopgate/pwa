import { css } from 'glamor';
import Color from 'color';
import { themeColors, themeShadows } from '@shopgate/pwa-common/helpers/config';

const backgroundColor = themeColors.lightDark;
const buttonColor = themeColors.accent;
const buttonColorContrast = Color(buttonColor).contrast(Color(backgroundColor));
// Button color can be anything. Fall back to white if accent is too dark.
const safebuttonColor = buttonColorContrast > 4 ? buttonColor : themeColors.light;

const container = css({
  position: 'fixed',
  height: 'var(--snack-bar-height, 80px)',
  // Quick workaround for a feature introduced with PWA6 CCP-2358 (hide TabBar on scroll down).
  // TabBar is position fixed now, to its height is not recognized when footer height is measured.
  // Without the fix SnackBar would overlap the TabBar.
  bottom: 'max(var(--footer-height), calc(var(--tabbar-height, 0px) + var(--safe-area-inset-bottom)))',
  transition: 'bottom 0.3s ease',
  overflow: 'hidden',
  zIndex: 6,
  width: '100%',
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
  boxShadow: themeShadows.toast,
  color: themeColors.light,
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
