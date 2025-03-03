import { css } from 'glamor';
import {
  useScrollContainer,
  hasWebBridge,
  isIOSTheme,
  isWindows,
  isDev,
} from '@shopgate/engage/core/helpers';
import { themeConfig } from '@shopgate/engage';

const { typography } = themeConfig;
const iosThemeActive = isIOSTheme();

css.global('*, *:before, *:after', {
  boxSizing: 'border-box',
});

css.global('*', {
  touchAction: 'manipulation',
});

css.global('::-moz-focus-inner', {
  border: 0,
});

css.global('html, body', {
  WebkitTapHighlightColor: 'transparent',
  width: '100%',
  height: '100%',
});

css.global('html', {
  overflow: useScrollContainer() ? 'hidden' : 'inherit',
  MozOsxFontSmoothing: 'grayscale',
  WebkitFontSmoothing: 'antialiased',
  MsTextSizeAdjust: '100%',
  WebkitTextSizeAdjust: '100%',
  minHeight: '100%',
});

// Include Roboto font on Windows in dev mode on iOS theme, so that developers see nice fonts.
const fontSuffix = isDev && iosThemeActive && isWindows && !(typography.family ?? '').includes('Roboto')
  ? ', Roboto'
  : '';

css.global('body', {
  font: `${typography.rootSize}px/${typography.lineHeight} ${typography.family}${fontSuffix}`,
  overflow: 'auto',
  margin: 0,
  WebkitOverflowScrolling: 'touch',
  WebkitUserSelect: hasWebBridge() ? 'inherit' : 'none',
  userSelect: hasWebBridge() ? 'inherit' : 'none',
  color: 'var(--color-text-high-emphasis)',
});

css.global('[data-pattern]', {
  height: '100% !important',
});

css.global('html, body', {
  backgroundColor: 'var(--page-background-color)',
});

if (hasWebBridge() && !iosThemeActive) {
  css.insert(`@media(min-width: 600px) {
    html, body {
      background-color: var(--color-background-gutter-body, var(--page-background-color))
    }
  }`);
}

// since iOS 15 button has a default color of blue rgb(0, 122, 255);
css.global('button', {
  color: 'inherit',
});
