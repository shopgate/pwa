import { css } from 'glamor';
import { themeConfig } from '../../helpers/config';

const { colors } = themeConfig;

css.global('*, *:before, *:after', {
  boxSizing: 'border-box',
});

css.global('html', {
  background: colors.background,
  MozOsxFontSmoothing: 'grayscale',
  WebkitFontSmoothing: 'antialiased',
  MsTextSizeAdjust: '100%',
  WebkitTextSizeAdjust: '100%',
  WebkitTapHighlightColor: 'transparent',
  minHeight: '100%',
});

css.global('body', {
  background: colors.background,
  margin: 0,
  WebkitTapHighlightColor: 'transparent',
  minHeight: '100%',
});
