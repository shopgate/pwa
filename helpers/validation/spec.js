/*
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isNumeric } from './index';

describe('helpers/validation', () => {
  describe('isNumeric', () => {
    describe('Non-regression, "123" is not numeric', () => {
      it('should treat numeric number as numeric', () => {
        expect(isNumeric('123')).toBe(true);
      });
    });
  });
});
