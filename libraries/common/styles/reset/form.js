import { css } from 'glamor';

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 */
css.global('button, html [type="button"], [type="reset"], [type="submit"]', {
  WebkitAppearance: 'button',
});

/**
 * 1. Change font properties to `inherit` in Safari.
 * 2. Correct the inability to style clickable types in iOS and Safari.
 */
css.global('::-webkit-file-upload-button', {
  font: 'inherit',
  WebkitAppearance: 'button',
});

/**
 * Remove the inner padding and cancel buttons in Chrome and Safari for OS X.
 */
css.global('::-webkit-search-cancel-button, ::-webkit-search-decoration', {
  WebkitAppearance: 'none',
});

css.global('button, input, select, textarea', {
  background: 'transparent',
  border: 0,
  fontSize: '1em',
  margin: 0,
});

css.global('input, select, textarea', {
  fontFamily: 'inherit',
});

css.global('button, textarea', {
  fontFamily: 'inherit',
  lineHeight: 'inherit',
});

css.global('button', {
  borderRadius: 0,
});

css.global('button, label, [type="checkbox"], [type="radio"]', {
  cursor: 'pointer',
});

css.global('label', {
  display: 'inline-block',
});

css.global('textarea', {
  minHeight: '5em',
  maxWidth: '100%',
  resize: 'none',
});

css.global('[type="search"]', {
  WebkitAppearance: 'textfield',
});
