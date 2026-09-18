import decodeHTML from './decodeHTML';

describe('decodeHTML()', () => {
  it('should decode HTML entities', () => {
    expect(decodeHTML('Tom &amp; Jerry')).toBe('Tom & Jerry');
    expect(decodeHTML('&lt;p&gt;Text&lt;/p&gt;')).toBe('<p>Text</p>');
  });

  it('should return an empty string for empty input', () => {
    expect(decodeHTML('')).toBe('');
  });

  it('should not turn markup into DOM nodes', () => {
    const spy = jest.fn();
    window.xssSpy = spy;

    expect(decodeHTML('<img src=x onerror="window.xssSpy()">')).toBe('<img src=x onerror="window.xssSpy()">');
    expect(spy).not.toHaveBeenCalled();

    delete window.xssSpy;
  });
});
