/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getKnownRelatives } from './variants';

describe('Favorites - selectors', () => {
  describe('getKnownRelatives', () => {
    const products = {
      product: {
        productsById: {
          parent: {
            productData: {
              id: 'parent',
              baseProductId: null,
              flags: {
                hasVariants: true,
              },
            },
          },
          child: {
            productData: {
              id: 'child',
              baseProductId: 'parent',
              flags: {
                hasVariants: false,
              },
            },
          },
          child2: {
            productData: {
              id: 'child2',
              baseProductId: 'parent',
              flags: {
                hasVariants: false,
              },
            },
          },
          notAChild: {
            productData: {
              id: 'notAChild',
              baseProductId: 'foo',
              flags: {
                hasVariants: false,
              },
            },
          },
        },
      },
    };
    it('should return parent and children for given parentId', () => {
      expect(getKnownRelatives(products, 'parent')).toEqual(['parent', 'child', 'child2']);
    });
    it('should return parent and children for given child id', () => {
      expect(getKnownRelatives(products, 'child')).toEqual(['parent', 'child', 'child2']);
    });
    it('should return notAChild and it\'s parent only', () => {
      expect(getKnownRelatives(products, 'notAChild')).toEqual(['notAChild', 'foo']);
    });
  });
});
