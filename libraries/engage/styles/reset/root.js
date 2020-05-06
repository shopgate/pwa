import { css } from 'glamor';
import { useScrollContainer, hasWebBridge } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { typography } = themeConfig;

css.global('*, *:before, *:after', {
  boxSizing: 'border-box',
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
  background: 'var(--page-background-color)',
});

