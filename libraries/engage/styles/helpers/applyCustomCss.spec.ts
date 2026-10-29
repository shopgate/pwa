import { applyCustomCss, CUSTOM_CSS_STYLE_TAG_ID } from './applyCustomCss';

const getStyleTag = () => document.getElementById(CUSTOM_CSS_STYLE_TAG_ID);

describe('applyCustomCss', () => {
  beforeEach(() => {
    document.head.innerHTML = [
      '<meta name="theme-css-insertion-point" content="" />',
      '<meta name="preview-css-insertion-point" content="" />',
      '<meta name="custom-css-insertion-point" content="" />',
      '<style id="late-style"></style>',
    ].join('');
  });

  it('writes the stylesheet right after its insertion point', () => {
    applyCustomCss('.headline { color: red; }');

    expect(getStyleTag()?.textContent).toBe('.headline { color: red; }');
    expect(getStyleTag()?.previousElementSibling?.getAttribute('name')).toBe('custom-css-insertion-point');
  });

  it('updates the existing tag', () => {
    applyCustomCss('.a { color: red; }');
    applyCustomCss('.a { color: blue; }');

    expect(document.querySelectorAll(`#${CUSTOM_CSS_STYLE_TAG_ID}`)).toHaveLength(1);
    expect(getStyleTag()?.textContent).toBe('.a { color: blue; }');
  });

  it('removes the tag when the stylesheet is cleared', () => {
    applyCustomCss('.a { color: red; }');
    applyCustomCss('');

    expect(getStyleTag()).toBeNull();
  });

  it('appends to the head without an insertion point', () => {
    document.head.innerHTML = '<style id="other"></style>';

    applyCustomCss('.a { color: red; }');

    expect(document.head.lastElementChild).toBe(getStyleTag());
  });
});
