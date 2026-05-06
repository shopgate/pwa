/**
 * @deprecated used @shopgate/engage/styles instead
 */

import { injectGlobal } from '@shopgate/engage/styles';
import { themeConfig } from '../../helpers/config';

const { typography } = themeConfig;

injectGlobal({
  '*, *:before, *:after': {
    boxSizing: 'border-box',
  },
  'html, body': {
    WebkitTapHighlightColor: 'transparent',
    width: '100%',
    height: '100%',
  },
  html: {
    overflow: 'hidden',
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
    MsTextSizeAdjust: '100%',
    WebkitTextSizeAdjust: '100%',
    minHeight: '100%',
  },
  body: {
    font: `${typography.rootSize}px/${typography.lineHeight} ${typography.family}`,
    overflow: 'auto',
    margin: 0,
    WebkitOverflowScrolling: 'touch',
    WebkitUserSelect: 'none',
  },
  '[data-pattern]': {
    height: '100% !important',
  },
});
