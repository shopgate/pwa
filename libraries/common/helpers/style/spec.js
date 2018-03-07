/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { rem } from './index';

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
    let consoleSpy;

    beforeAll(() => {
      // Deactivate the console for the next tests to avoid logs within the test report.
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    afterEach(() => {
      consoleSpy.mockReset();
    });

    it('should output 1rem as fallback for wrong parameters', () => {
      expect(rem('rem')).toBe('1rem');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
  });
});
