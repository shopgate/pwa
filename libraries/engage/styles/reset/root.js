import {
  applyScrollContainer,
  hasWebBridge,
  isIOSTheme,
} from '@shopgate/engage/core/helpers';
import { configuration } from '@shopgate/engage/core/collections';
import { CONFIGURATION_COLLECTION_KEY_HAS_ROOT_TYPOGRAPHY } from '@shopgate/engage/core/constants';
import { themeConfig } from '@shopgate/engage';
import { injectGlobal } from '..';
import {
  CSS_ROOT_FONT_FAMILY,
  CSS_ROOT_FONT_SIZE,
  CSS_ROOT_LINE_HEIGHT,
} from './typographyCustomProps';

const { typography } = themeConfig;
const iosThemeActive = isIOSTheme();

// Flag (for feature-detecting extensions) that base typography is applied on the root element.
configuration.set(CONFIGURATION_COLLECTION_KEY_HAS_ROOT_TYPOGRAPHY, true);

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
    // Base typography on the root element. The build-time defaults are published as `--sg-root-*`
    // props and consumed here, so a higher-specificity `:root` override (admin css / live preview /
    // extension) wins. The default is the property value, not a `var()` fallback (a comma-separated
    // family list can't be a fallback). Roboto is appended as an iOS fallback.
    [CSS_ROOT_FONT_FAMILY]: `${typography.family}${
      iosThemeActive && !(typography.family || '').includes('Roboto') ? ', Roboto' : ''
    }`,
    [CSS_ROOT_FONT_SIZE]: `${typography.rootSize}px`,
    [CSS_ROOT_LINE_HEIGHT]: `${typography.lineHeight}`,
    fontFamily: `var(${CSS_ROOT_FONT_FAMILY})`,
    fontSize: `var(${CSS_ROOT_FONT_SIZE})`,
    lineHeight: `var(${CSS_ROOT_LINE_HEIGHT})`,
    color: 'var(--sg-palette-text-primary, var(--color-text-high-emphasis))',
    overflow: applyScrollContainer() ? 'hidden' : 'inherit',
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
    MsTextSizeAdjust: '100%',
    WebkitTextSizeAdjust: '100%',
    minHeight: '100%',
  },
  body: {
    overflow: 'auto',
    margin: 0,
    WebkitOverflowScrolling: 'touch',
    WebkitUserSelect: hasWebBridge() ? 'inherit' : 'none',
    userSelect: hasWebBridge() ? 'inherit' : 'none',
  },
  '[data-pattern]': {
    height: '100% !important',
  },
  // since iOS 15 button has a default color of blue rgb(0, 122, 255);
  button: {
    color: 'inherit',
  },
  ...hasWebBridge() && !iosThemeActive && {
    '@media (min-width: 600px)': {
      html: {
        backgroundColor: 'var(--color-background-gutter-body, var(--page-background-color))',
      },
    },
  },
});
