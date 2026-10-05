import {
  applySelection, buildRows, orderSelection, selectSingleValues,
} from './selection';
import type { ProductVariants } from './types';

const variants: ProductVariants = {
  characteristics: [
    {
      id: 'size',
      label: 'Size',
      values: [{ id: 's', label: 'S' }, { id: 'l', label: 'L' }],
    },
    {
      id: 'color',
      label: 'Color',
      values: [{ id: 'black', label: 'Black' }, { id: 'blue', label: 'Blue' }, { id: 'gold', label: 'Gold' }],
    },
  ],
  products: [
    { id: 's-black', characteristics: { color: 'black', size: 's' } },
    { id: 's-blue', characteristics: { color: 'blue', size: 's' } },
    { id: 's-gold', characteristics: { color: 'gold', size: 's' } },
    { id: 'l-black', characteristics: { color: 'black', size: 'l' } },
    { id: 'l-gold', characteristics: { color: 'gold', size: 'l' } },
  ],
};

describe('VariantSelector selection', () => {
  it('orders a selection like the characteristics', () => {
    expect(Object.keys(orderSelection({ color: 'black', size: 's' }, variants)))
      .toEqual(['size', 'color']);
  });

  it('selects characteristics with a single value', () => {
    const single: ProductVariants = {
      characteristics: [
        { id: 'size', label: 'Size', values: [{ id: 'one', label: 'onesize' }] },
        variants.characteristics[1],
      ],
      products: [],
    };

    expect(selectSingleValues({}, single)).toEqual({ size: 'one' });
  });

  it('switches the color of a complete selection', () => {
    expect(applySelection(variants, { size: 's', color: 'black' }, 'color', 'gold'))
      .toEqual({ size: 's', color: 'gold' });
  });

  it('drops a value that does not fit the new selection', () => {
    expect(applySelection(variants, { size: 's', color: 'blue' }, 'size', 'l'))
      .toEqual({ size: 'l' });
  });

  it('completes the selection when only one variant is left', () => {
    expect(applySelection(variants, {}, 'color', 'blue')).toEqual({ size: 's', color: 'blue' });
  });

  it('marks unavailable combinations but keeps them selectable', () => {
    const [, color] = buildRows(variants, { size: 'l' });

    expect(color.values.map(value => [value.id, value.available, value.selectable])).toEqual([
      ['black', true, true],
      ['blue', false, true],
      ['gold', true, true],
    ]);
  });
});
