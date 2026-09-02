import {
  applyScrollContainer,
  hasWebBridge,
} from '@shopgate/engage/core/helpers';
import { configuration } from '@shopgate/engage/core/collections';
import { CONFIGURATION_COLLECTION_KEY_HAS_ROOT_TYPOGRAPHY } from '@shopgate/engage/core/constants';
import { themeConfig } from '@shopgate/engage';
import { injectGlobal } from '..';
import {
  CSS_ROOT_FONT_FAMILY,
  CSS_ROOT_FONT_SIZE,
} from './typographyCustomProps';

const { typography } = themeConfig;

// Flag (for feature-detecting extensions) that base typography uses the `--sg-root-*` custom
// properties and the `body1` variant.
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
    // Publish the shared font family (used by every variant) and the rem anchor here. The base body
    // text itself is the `body1` variant, applied to `<body>` below. A higher-specificity `:root`
    // override (admin css / live preview / extension) wins. The family default is the property
    // value, not a `var()` fallback (a comma list can't be a fallback). Roboto is an iOS fallback.
    [CSS_ROOT_FONT_FAMILY]: `${typography.family}${
      !(typography.family || '').includes('Roboto') ? ', Roboto' : ''
    }`,
    [CSS_ROOT_FONT_SIZE]: `${typography.rootSize}px`,
    fontSize: `var(${CSS_ROOT_FONT_SIZE})`,
    color: 'var(--sg-palette-text-primary, var(--color-text-high-emphasis))',
    overflow: applyScrollContainer() ? 'hidden' : 'inherit',
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
    MsTextSizeAdjust: '100%',
    WebkitTextSizeAdjust: '100%',
    minHeight: '100%',
  },
  body: {
    // Base body text = the `body1` variant. Family is the shared root var; weight/size/line-height
    // come from the theme's `body1` css vars, with fallbacks so there is no flash before the theme
    // injects them. Configuring `body1` drives both this base text and the variant.
    fontFamily: `var(${CSS_ROOT_FONT_FAMILY})`,
    fontWeight: 'var(--sg-typography-body1-fontWeight, 400)',
    fontSize: 'var(--sg-typography-body1-fontSize, 1rem)',
    lineHeight: 'var(--sg-typography-body1-lineHeight, 1.5)',
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
});
