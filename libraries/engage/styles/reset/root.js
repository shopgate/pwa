import {
  useScrollContainer,
  hasWebBridge,
  isIOSTheme,
} from '@shopgate/engage/core/helpers';
import { themeConfig } from '@shopgate/engage';
import { injectGlobal } from '..';
import { insertGlobalRaw } from '../utils/globalStyles';

const { typography } = themeConfig;
const iosThemeActive = isIOSTheme();

injectGlobal({
  '*, *:before, *:after': {
    boxSizing: 'border-box',
  },
  '*': {
    touchAction: 'manipulation',
  },
  '::-moz-focus-inner': {
    border: 0,
  },
  'html, body': {
    WebkitTapHighlightColor: 'transparent',
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--page-background-color)',
  },
  html: {
    overflow: useScrollContainer() ? 'hidden' : 'inherit',
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
    MsTextSizeAdjust: '100%',
    WebkitTextSizeAdjust: '100%',
    minHeight: '100%',
  },
  body: {
    // Include Roboto font as a fallback to the iOS theme when other fonts are not available
    font: `${typography.rootSize}px/${typography.lineHeight} ${typography.family}${
      iosThemeActive && !(typography.family || '').includes('Roboto') ? ', Roboto' : ''
    }`,
    overflow: 'auto',
    margin: 0,
    WebkitOverflowScrolling: 'touch',
    WebkitUserSelect: hasWebBridge() ? 'inherit' : 'none',
    userSelect: hasWebBridge() ? 'inherit' : 'none',
    color: 'var(--color-text-high-emphasis)',
  },
  '[data-pattern]': {
    height: '100% !important',
  },
  button: {
    color: 'inherit',
  },
});

if (hasWebBridge() && !iosThemeActive) {
  insertGlobalRaw(`@media(min-width: 600px) {
    html, body {
      background-color: var(--color-background-gutter-body, var(--page-background-color))
    }
  }`);
}
