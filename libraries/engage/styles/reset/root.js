import {
  useScrollContainer,
  hasWebBridge,
  isIOSTheme,
} from '@shopgate/engage/core/helpers';
import { themeConfig } from '@shopgate/engage';
import { insertGlobalRaw, insertGlobalRule } from '../utils/globalStyles';

const { typography } = themeConfig;
const iosThemeActive = isIOSTheme();

insertGlobalRule('*, *:before, *:after', {
  boxSizing: 'border-box',
});

insertGlobalRule('*', {
  touchAction: 'manipulation',
});

insertGlobalRule('::-moz-focus-inner', {
  border: 0,
});

insertGlobalRule('html, body', {
  WebkitTapHighlightColor: 'transparent',
  width: '100%',
  height: '100%',
});

insertGlobalRule('html', {
  overflow: useScrollContainer() ? 'hidden' : 'inherit',
  MozOsxFontSmoothing: 'grayscale',
  WebkitFontSmoothing: 'antialiased',
  MsTextSizeAdjust: '100%',
  WebkitTextSizeAdjust: '100%',
  minHeight: '100%',
});

// Include Roboto font as a fallback to the iOS theme when other fonts are not available
const fontSuffix = iosThemeActive && !(typography.family || '').includes('Roboto')
  ? ', Roboto'
  : '';

insertGlobalRule('body', {
  font: `${typography.rootSize}px/${typography.lineHeight} ${typography.family}${fontSuffix}`,
  overflow: 'auto',
  margin: 0,
  WebkitOverflowScrolling: 'touch',
  WebkitUserSelect: hasWebBridge() ? 'inherit' : 'none',
  userSelect: hasWebBridge() ? 'inherit' : 'none',
  color: 'var(--color-text-high-emphasis)',
});

insertGlobalRule('[data-pattern]', {
  height: '100% !important',
});

insertGlobalRule('html, body', {
  backgroundColor: 'var(--page-background-color)',
});

if (hasWebBridge() && !iosThemeActive) {
  insertGlobalRaw(`@media(min-width: 600px) {
    html, body {
      background-color: var(--color-background-gutter-body, var(--page-background-color))
    }
  }`);
}

// since iOS 15 button has a default color of blue rgb(0, 122, 255);
insertGlobalRule('button', {
  color: 'inherit',
});
