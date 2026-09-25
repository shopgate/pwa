import {
  PREVIEW_STYLE_TAG_ID,
  getOrCreateStyleTag,
  removeStyleTag,
  serializeStyling,
} from './helpers';

describe('FrontendSettingsPreviewBridge helpers', () => {
  describe('serializeStyling', () => {
    it('converts camelCase properties to kebab-case', () => {
      const css = serializeStyling({ '.button': { backgroundColor: 'red' } });

      expect(css).toBe('.button { background-color: red; }');
    });

    it('appends px to numeric values of length-based properties', () => {
      const css = serializeStyling({
        '.button': {
          fontSize: 16,
          marginTop: 8,
        },
      });

      expect(css).toBe('.button { font-size: 16px; margin-top: 8px; }');
    });

    it('does not append px to unitless properties', () => {
      const css = serializeStyling({
        '.button': {
          fontWeight: 700,
          lineHeight: 1.5,
          zIndex: 10,
          opacity: 0.5,
        },
      });

      expect(css).toBe('.button { font-weight: 700; line-height: 1.5; z-index: 10; opacity: 0.5; }');
    });

    it('serializes a zero value without a unit', () => {
      const css = serializeStyling({ '.button': { margin: 0 } });

      expect(css).toBe('.button { margin: 0; }');
    });

    it('passes string values through untouched', () => {
      const css = serializeStyling({ '.button': { transform: 'translateX(10px)' } });

      expect(css).toBe('.button { transform: translateX(10px); }');
    });

    it('keeps custom properties as-is and never adds a unit to them', () => {
      const css = serializeStyling({
        ':root': {
          '--primary-color': '#fff',
          '--spacing': 8,
        },
      });

      expect(css).toBe(':root { --primary-color: #fff; --spacing: 8; }');
    });

    it('joins multiple selectors with a newline', () => {
      const css = serializeStyling({
        '.a': { color: 'red' },
        '.b': { color: 'blue' },
      });

      expect(css).toBe('.a { color: red; }\n.b { color: blue; }');
    });

    it('skips selectors that have no declarations', () => {
      const css = serializeStyling({
        '.empty': {},
        '.a': { color: 'red' },
      });

      expect(css).toBe('.a { color: red; }');
    });

    it('returns an empty string when there is nothing to serialize', () => {
      expect(serializeStyling({})).toBe('');
    });
  });

  describe('getOrCreateStyleTag', () => {
    afterEach(() => {
      removeStyleTag();
      document.head.innerHTML = '';
    });

    it('inserts the style tag at the preview css insertion point', () => {
      document.head.innerHTML = `
        <meta name="theme-css-insertion-point" content="" />
        <link id="theme-css" rel="stylesheet" />
        <meta name="preview-css-insertion-point" content="" />
      `;

      const styleTag = getOrCreateStyleTag();
      const insertionPoint = document.querySelector('meta[name="preview-css-insertion-point"]');

      expect(insertionPoint?.nextElementSibling).toBe(styleTag);
    });

    it('keeps the style tag below the theme css file', () => {
      document.head.innerHTML = `
        <meta name="theme-css-insertion-point" content="" />
        <link id="theme-css" rel="stylesheet" />
        <meta name="preview-css-insertion-point" content="" />
      `;

      getOrCreateStyleTag();

      const ids = Array.from(document.head.children).map(child => child.id).filter(Boolean);

      expect(ids).toEqual(['theme-css', PREVIEW_STYLE_TAG_ID]);
    });

    it('appends the style tag when the insertion point is missing', () => {
      const styleTag = getOrCreateStyleTag();

      expect(document.head.lastChild).toBe(styleTag);
    });

    it('creates a style tag in the document head on first call', () => {
      const styleTag = getOrCreateStyleTag();

      expect(styleTag.tagName).toBe('STYLE');
      expect(styleTag.id).toBe(PREVIEW_STYLE_TAG_ID);
      expect(styleTag.getAttribute('type')).toBe('text/css');
      expect(document.head.contains(styleTag)).toBe(true);
    });

    it('returns the existing tag without creating a duplicate', () => {
      const first = getOrCreateStyleTag();
      const second = getOrCreateStyleTag();

      expect(second).toBe(first);
      expect(document.querySelectorAll(`#${PREVIEW_STYLE_TAG_ID}`)).toHaveLength(1);
    });
  });

  describe('removeStyleTag', () => {
    it('removes the preview style tag when it exists', () => {
      getOrCreateStyleTag();

      removeStyleTag();

      expect(document.getElementById(PREVIEW_STYLE_TAG_ID)).toBeNull();
    });

    it('does nothing when there is no preview style tag', () => {
      expect(() => removeStyleTag()).not.toThrow();
      expect(document.getElementById(PREVIEW_STYLE_TAG_ID)).toBeNull();
    });
  });
});
