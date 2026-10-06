import { getNearbyVariantIds } from './usePrefetchVariants';
import type { ProductVariants } from './types';

jest.mock('@shopgate/pwa-common-commerce/product/actions/fetchProductsById', () => jest.fn());

const variants: ProductVariants = {
  characteristics: [
    {
      id: 'size',
      label: 'Size',
      values: [],
    },
    {
      id: 'color',
      label: 'Color',
      values: [],
    },
  ],
  products: [
    {
      id: 's-black',
      characteristics: {
        size: 's',
        color: 'black',
      },
    },
    {
      id: 's-gold',
      characteristics: {
        size: 's',
        color: 'gold',
      },
    },
    {
      id: 'm-black',
      characteristics: {
        size: 'm',
        color: 'black',
      },
    },
    {
      id: 'm-gold',
      characteristics: {
        size: 'm',
        color: 'gold',
      },
    },
  ],
};

describe('getNearbyVariantIds()', () => {
  it('returns nothing without selection', () => {
    expect(getNearbyVariantIds(variants, {})).toEqual([]);
  });

  it('returns the selected variant first and the variants one selection away', () => {
    expect(getNearbyVariantIds(variants, {
      size: 's',
      color: 'black',
    }))
      .toEqual(['s-black', 's-gold', 'm-black']);
  });

  it('returns all variants with a partially selected value', () => {
    expect(getNearbyVariantIds(variants, { color: 'gold' })).toEqual(['s-gold', 'm-gold', 's-black', 'm-black']);
  });

  it('respects the limit', () => {
    expect(getNearbyVariantIds(variants, { color: 'gold' }, 2)).toEqual(['s-gold', 'm-gold']);
  });
});
