import { injectGlobal } from '..';

injectGlobal({
  /**
   * 1. Correct the inability to style clickable types in iOS and Safari.
   */
  'button, html [type="button"], [type="reset"], [type="submit"]': {
    WebkitAppearance: 'button',
  },
  /**
   * 1. Change font properties to `inherit` in Safari.
   * 2. Correct the inability to style clickable types in iOS and Safari.
   */
  '::-webkit-file-upload-button': {
    font: 'inherit',
    WebkitAppearance: 'button',
  },
  /**
   * Remove the inner padding and cancel buttons in Chrome and Safari for OS X.
   */
  '::-webkit-search-cancel-button, ::-webkit-search-decoration': {
    WebkitAppearance: 'none',
  },
  'button, input, select, textarea': {
    background: 'transparent',
    border: 0,
    fontSize: '1em',
    margin: 0,
  },
  'input, select, textarea': {
    fontFamily: 'inherit',
  },
  'button, textarea': {
    fontFamily: 'inherit',
    lineHeight: 'inherit',
  },
  button: {
    borderRadius: 0,
  },
  'button, label, [type="checkbox"], [type="radio"]': {
    cursor: 'pointer',
  },
  label: {
    display: 'inline-block',
  },
  textarea: {
    minHeight: '5em',
    maxWidth: '100%',
    resize: 'none',
  },
  '[type="search"]': {
    WebkitAppearance: 'textfield',
  },
});
