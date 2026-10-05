import {
  decorateRows,
  isVariantSoldOut,
  resolveRendererType,
  sortSizeValues,
} from './helpers';
import type { ProductVariants, VariantSelectorRow } from './types';

const labels = (values: { label: string }[]) => values.map(value => value.label);
const toValues = (list: string[]) => list.map(label => ({ id: label, label }));

describe('VariantSelector helpers', () => {
  describe('sortSizeValues()', () => {
    it('sorts letter sizes including numbered extra sizes', () => {
      const values = toValues(['XS', 'S', 'M', 'L', 'XL', '2XS', '2XL', '3XL', 'XXL', '4XL']);

      expect(labels(sortSizeValues(values)))
        .toEqual(['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL']);
    });

    it('sorts numeric and combined sizes', () => {
      const values = toValues(['42', '38/40', '38', '36,5', 'W32/L34', 'W32/L30']);

      expect(labels(sortSizeValues(values)))
        .toEqual(['W32/L30', 'W32/L34', '36,5', '38', '38/40', '42']);
    });

    it('keeps the order when not every value is a size', () => {
      const values = toValues(['L', 'One Size', 'S']);

      expect(labels(sortSizeValues(values))).toEqual(['L', 'One Size', 'S']);
    });

    it('keeps the order of colors', () => {
      const values = toValues(['red', 'black']);

      expect(labels(sortSizeValues(values))).toEqual(['red', 'black']);
    });
  });

  describe('isVariantSoldOut()', () => {
    it('detects sold out variants', () => {
      expect(isVariantSoldOut({
        id: '1',
        characteristics: {},
        stock: { quantity: 0, ignoreQuantity: false },
      })).toBe(true);
      expect(isVariantSoldOut({ id: '1', characteristics: {}, stock: { orderable: false } }))
        .toBe(true);
    });

    it('treats variants with ignored quantity or without stock as available', () => {
      expect(isVariantSoldOut({
        id: '1',
        characteristics: {},
        stock: { quantity: 0, ignoreQuantity: true, orderable: true },
      })).toBe(false);
      expect(isVariantSoldOut({ id: '1', characteristics: {} })).toBe(false);
    });
  });

  describe('resolveRendererType()', () => {
    const row = (label: string, swatch = false): VariantSelectorRow => ({
      id: label,
      label,
      disabled: false,
      selected: null,
      swatch,
      values: [],
    });
    const settings = {
      type: 'dropdown' as const,
      swatchCharacteristics: ['farbe', 'color'],
      chipCharacteristics: ['größe'],
    };

    it('uses the characteristic lists before the default type', () => {
      expect(resolveRendererType(row('Farbe'), settings, false)).toBe('swatches');
      expect(resolveRendererType(row(' Größe '), settings, false)).toBe('chips');
      expect(resolveRendererType(row('Material'), settings, false)).toBe('dropdown');
    });

    it('keeps beta swatches only in beta mode', () => {
      expect(resolveRendererType(row('Muster', true), settings, true)).toBe('swatches');
      expect(resolveRendererType(row('Muster', true), settings, false)).toBe('dropdown');
    });
  });

  describe('decorateRows()', () => {
    const variants: ProductVariants = {
      characteristics: [
        {
          id: 'color',
          label: 'Color',
          values: [{ id: 'red', label: 'Red' }, { id: 'blue', label: 'Blue', swatch: { color: '#00f' } }],
        },
        {
          id: 'size',
          label: 'Size',
          values: [{ id: 'l', label: 'L' }, { id: 's', label: 'S' }],
        },
      ],
      products: [
        {
          id: 'red-s',
          characteristics: { color: 'red', size: 's' },
          stock: { quantity: 0, ignoreQuantity: false },
          featuredImageBaseUrl: 'red.jpg',
        },
        {
          id: 'red-l',
          characteristics: { color: 'red', size: 'l' },
          stock: { quantity: 0, ignoreQuantity: false },
        },
        { id: 'blue-s', characteristics: { color: 'blue', size: 's' }, stock: { quantity: 3 } },
      ],
    };

    const rows: VariantSelectorRow[] = variants.characteristics.map(char => ({
      id: char.id,
      label: char.label,
      disabled: false,
      selected: null,
      swatch: false,
      values: char.values.map(value => ({ ...value, selectable: true, selected: false })),
    }));

    const settings = {
      sortSizes: true,
      soldOut: 'strike' as const,
      swatchSource: 'variantImage' as const,
    };

    it('marks values whose variants are all sold out', () => {
      const [color] = decorateRows(rows, variants, {}, settings);

      expect(color.values.map(value => value.soldOut)).toEqual([true, false]);
    });

    it('considers the selection of previous characteristics', () => {
      const [, size] = decorateRows(rows, variants, { color: 'blue' }, settings);

      expect(size.values.find(value => value.id === 's')?.soldOut).toBe(false);
    });

    it('resolves swatches from the backend before the variant image', () => {
      const [color] = decorateRows(rows, variants, {}, settings);

      expect(color.values[0].swatch).toEqual({ imageUrl: 'red.jpg' });
      expect(color.values[1].swatch).toEqual({ color: '#00f' });
    });

    it('sorts sizes and hides sold out values when configured', () => {
      const [color, size] = decorateRows(
        rows,
        variants,
        { color: 'blue' },
        { ...settings, soldOut: 'hide' }
      );

      expect(labels(size.values)).toEqual(['S', 'L']);
      expect(labels(color.values)).toEqual(['Blue']);
    });
  });
});
