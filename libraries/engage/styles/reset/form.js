import { insertGlobalRule } from '../utils/globalStyles';

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 */
insertGlobalRule('button, html [type="button"], [type="reset"], [type="submit"]', {
  WebkitAppearance: 'button',
});

/**
 * 1. Change font properties to `inherit` in Safari.
 * 2. Correct the inability to style clickable types in iOS and Safari.
 */
insertGlobalRule('::-webkit-file-upload-button', {
  font: 'inherit',
  WebkitAppearance: 'button',
});

/**
 * Remove the inner padding and cancel buttons in Chrome and Safari for OS X.
 */
insertGlobalRule('::-webkit-search-cancel-button, ::-webkit-search-decoration', {
  WebkitAppearance: 'none',
});

insertGlobalRule('button, input, select, textarea', {
  background: 'transparent',
  border: 0,
  fontSize: '1em',
  margin: 0,
});

insertGlobalRule('input, select, textarea', {
  fontFamily: 'inherit',
});

insertGlobalRule('button, textarea', {
  fontFamily: 'inherit',
  lineHeight: 'inherit',
});

insertGlobalRule('button', {
  borderRadius: 0,
});

insertGlobalRule('button, label, [type="checkbox"], [type="radio"]', {
  cursor: 'pointer',
});

insertGlobalRule('label', {
  display: 'inline-block',
});

insertGlobalRule('textarea', {
  minHeight: '5em',
  maxWidth: '100%',
  resize: 'none',
});

insertGlobalRule('[type="search"]', {
  WebkitAppearance: 'textfield',
});
