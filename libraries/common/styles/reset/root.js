import { css } from 'glamor';
import { themeConfig } from '../../helpers/config';

const { colors } = themeConfig;

css.global('*, *:before, *:after', {
  boxSizing: 'border-box',
});

css.global('html, body', {
  overflow: 'hidden',
  background: colors.background,
  WebkitTapHighlightColor: 'transparent',
  minHeight: '100%',
});

css.global('html', {
  MozOsxFontSmoothing: 'grayscale',
  WebkitFontSmoothing: 'antialiased',
  MsTextSizeAdjust: '100%',
  WebkitTextSizeAdjust: '100%',
  minHeight: '100%',
});

css.global('body', {
  margin: 0,
});
