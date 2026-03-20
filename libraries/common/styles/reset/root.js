/**
 * @deprecated used @shopgate/engage/styles instead
 */

import { insertGlobalRule } from '@shopgate/engage/styles/utils/globalStyles';
import { themeConfig } from '../../helpers/config';

const { typography } = themeConfig;

insertGlobalRule('*, *:before, *:after', {
  boxSizing: 'border-box',
});

insertGlobalRule('html, body', {
  WebkitTapHighlightColor: 'transparent',
  width: '100%',
  height: '100%',
});

insertGlobalRule('html', {
  overflow: 'hidden',
  MozOsxFontSmoothing: 'grayscale',
  WebkitFontSmoothing: 'antialiased',
  MsTextSizeAdjust: '100%',
  WebkitTextSizeAdjust: '100%',
  minHeight: '100%',
});

insertGlobalRule('body', {
  font: `${typography.rootSize}px/${typography.lineHeight} ${typography.family}`,
  overflow: 'auto',
  margin: 0,
  WebkitOverflowScrolling: 'touch',
  WebkitUserSelect: 'none',
});

insertGlobalRule('[data-pattern]', {
  height: '100% !important',
});
