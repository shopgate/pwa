import { css } from 'glamor';
import { useScrollContainer, hasWebBridge, isIOSTheme } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

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

css.global('body', {
  font: `${typography.rootSize}px/${typography.lineHeight} ${typography.family}`,
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
