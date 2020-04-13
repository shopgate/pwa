/**
 * @deprecated used @shopgate/engage/styles instead
 */

import { css } from 'glamor';
import { themeConfig } from '../../helpers/config';

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
  overflow: 'hidden',
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
  WebkitUserSelect: 'none',
});

css.global('[data-pattern]', {
  height: '100% !important',
});
