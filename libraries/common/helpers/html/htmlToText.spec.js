import htmlToText from './htmlToText';

describe('htmlToText()', () => {
  it('should return an empty string for empty or invalid input', () => {
    expect(htmlToText('')).toBe('');
    expect(htmlToText(null)).toBe('');
    expect(htmlToText(undefined)).toBe('');
    expect(htmlToText(123)).toBe('');
  });

  it('should return plain text unchanged', () => {
    expect(htmlToText('Some product name')).toBe('Some product name');
  });

  it('should decode HTML entities', () => {
    expect(htmlToText('Tom &amp; Jerry &quot;Deluxe&quot; &uuml;ber')).toBe('Tom & Jerry "Deluxe" über');
  });

  it('should keep encoded markup as text', () => {
    expect(htmlToText('&lt;img src=x onerror=alert(1)&gt;')).toBe('<img src=x onerror=alert(1)>');
  });

  it('should strip HTML tags', () => {
    expect(htmlToText('<b>Bold</b> name')).toBe('Bold name');
  });

  it('should not create elements within the document for malicious input', () => {
    const spy = jest.fn();
    window.xssSpy = spy;

    const result = htmlToText('Search<img src=x onerror="window.xssSpy()"><script>window.xssSpy()</script>');

    expect(result).toBe('Searchwindow.xssSpy()');
    expect(document.querySelector('img')).toBeNull();
    expect(spy).not.toHaveBeenCalled();

    delete window.xssSpy;
  });
});
