/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { hex2bin, bin2hex, sortObject } from './index';

describe('data helpers', () => {
  describe('bin2hex and hex2bin conversion', () => {
    describe('successful conversions', () => {
      const tests = [
        [0, '30'],
        [4711, 34373131],
        ['0815', 30383135],
        ['my favourite product', '6d79206661766f75726974652070726f64756374'],
        ['X/5a-32:z@P $%"=?+*#', '582f35612d33323a7a4050202425223d3f2b2a23'],
      ];

      tests.forEach((test) => {
        const bin = test[0];
        const hex = test[1];

        it(`should convert "${bin}" (bin) to "${hex}" (hex)`, () => {
          expect(bin2hex(bin)).toEqual(hex.toString());
        });

        it(`should convert "${hex}" (hex) to "${bin}" (bin)`, () => {
          expect(hex2bin(hex)).toEqual(bin.toString());
        });
      });
    });

    describe('failing conversions', () => {
      const hex = 'thisisnothex';

      it(`should NOT be able to convert "${hex}" to bin`, () => {
        expect(hex2bin(hex)).toEqual(false);
      });
    });
  });

  describe('Object sorting', () => {
    it('should sort a simple object', () => {
      const sourceObject = {
        ab: 'foo',
        ef: 'bar',
        bc: 'baz',
      };

      const resultObject = {
        ab: 'foo',
        bc: 'baz',
        ef: 'bar',
      };

      expect(sortObject(sourceObject)).toEqual(resultObject);
    });

    it('should sort a nested object', () => {
      const sourceObject = {
        ab: 'foo',
        ef: {
          12: 'bla',
          56: 'blub',
          34: 'blo',
        },
        bc: [
          'abc',
          {
            78: 'test',
            def: 'test3',
            abc: 'test2',
          },
          'def',
        ],
      };

      const resultObject = {
        ab: 'foo',
        bc: [
          'abc',
          {
            78: 'test',
            abc: 'test2',
            def: 'test3',
          },
          'def',
        ],
        ef: {
          12: 'bla',
          34: 'blo',
          56: 'blub',
        },
      };

      expect(sortObject(sourceObject)).toEqual(resultObject);
    });
  });
});
