import { css } from 'glamor';

css.global('*, *:before, *:after', {
  boxSizing: 'border-box',
});

css.global('html', {
  MozOsxFontSmoothing: 'grayscale',
  WebkitFontSmoothing: 'antialiased',
  MsTextSizeAdjust: '100%',
  WebkitTextSizeAdjust: '100%',
  WebkitTapHighlightColor: 'transparent',
});

css.global('body', {
  margin: 0,
  WebkitTapHighlightColor: 'transparent',
});
