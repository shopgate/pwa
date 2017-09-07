/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import { rem, mergeStyles } from './index';

/**
 * The style helper imports a fonts module from inside of the template, which contains the
 * root size for the rem calculations. To make the tests independent from the values inside
 * of this module, it's mocked here to have a constant value for the calculations.
 */
jest.mock('Templates/styles/fonts', () => ({ rootSize: 16 }));
jest.mock('Library/classes/Logger', () => ({ error: () => {} }));

describe('style helper', () => {
  describe('rem helper with 16px rootSize', () => {
    it('should output 0.875rem for 16px input', () => {
      expect(rem(16)).toBe('1rem');
    });

    it('should output 0.875rem for 14px input', () => {
      expect(rem(14)).toBe('0.875rem');
    });

    it('should output 0.75rem for 12px input', () => {
      expect(rem(12)).toBe('0.75rem');
    });

    it('should output 0rem for 0px input', () => {
      expect(rem(0)).toBe('0rem');
    });
  });

  describe('rem helper error handling', () => {
    it('should output 1rem as fallback for wrong parameters', () => {
      expect(rem('rem')).toBe('1rem');
    });
  });

  describe('merge styles', () => {
    it('should overwrite default styling', () => {
      /**
      * Considering that css caches styling that are the same
      * we can assume that if the resulting hash is different
      * it also means the styling changed.
      */

      const cachedUnchanged = css({
        height: 1,
      }).toString();

      const cachedChanged = css({
        backgroundColor: '#123',
        width: 123,
      }).toString();

      const defaults = {
        styleA: {
          backgroundColor: '#123',
          width: 123,
        },
        styleB: {
          height: 1,
        },
      };

      const extended = {
        styleA: {
          backgroundColor: '#567',
          width: 10,
        },
      };

      // Merges styling and check that the extended styling is really different!
      const merged = mergeStyles(defaults, extended);
      expect(merged.styleA).toBeTruthy();
      expect(merged.styleB).toBeTruthy();
      expect(merged.styleA).not.toEqual(cachedChanged);
      expect(merged.styleB).toEqual(cachedUnchanged);
    });
  });
});
