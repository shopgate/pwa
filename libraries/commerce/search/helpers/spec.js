import removeHighlightingPlaceholders from './removeHighlightingPlaceholders';

describe('search/helpers', () => {
  describe('removeHighlightingPlaceholers test', () => {
    it('should not change string without placeholders', () => {
      const result = removeHighlightingPlaceholders(['foo', 'bar']);
      expect(result[0]).toBe('foo');
    });

    it('should remove $start$ and $end$', () => {
      const testArray = [
        '$start$foo$end$',
        '$start$$end$',
        '$end$$start$',
        '$start$foo$end$',
      ];
      const result = removeHighlightingPlaceholders(testArray);
      result.forEach((item, key) => {
        expect(item.indexOf('start')).toBe(-1);
        expect(item.indexOf('end')).toBe(-1);
        expect(item.indexOf('$')).toBe(-1);
        expect(item.length).toBe(Math.max(testArray[key].length - 12, 0));
      });
    });
  });
});
