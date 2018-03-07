/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
