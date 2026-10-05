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
      swatchProperty: '',
      swatchImageZoom: 100,
    };

    it('marks values whose variants are all sold out', () => {
      const [color] = decorateRows(rows, variants, {}, settings);

      expect(color.values.map(value => value.soldOut)).toEqual([true, false]);
    });

    it('considers the selection of previous characteristics', () => {
      const [, size] = decorateRows(rows, variants, { color: 'blue' }, settings);

      expect(size.values.find(value => value.id === 's')?.soldOut).toBe(false);
    });

    it('uses the configured swatch source and falls back to the product data', () => {
      const [imageColor] = decorateRows(rows, variants, {}, settings);
      expect(imageColor.values[0].swatch).toEqual({ imageUrl: 'red.jpg' });
      expect(imageColor.values[1].swatch).toEqual({ color: '#00f' });

      const [backendColor] = decorateRows(rows, variants, {}, { ...settings, swatchSource: 'backend' });
      expect(backendColor.values[0].swatch).toBeUndefined();
      expect(backendColor.values[1].swatch).toEqual({ color: '#00f' });
    });

    it('reads swatches from a product property', () => {
      const withProperties: ProductVariants = {
        ...variants,
        products: variants.products.map(product => ({
          ...product,
          properties: [{ label: 'Hex', value: product.characteristics.color === 'red' ? '#ff0000' : 'https://img/blue.png' }],
        })),
      };
      const [color] = decorateRows(
        rows,
        withProperties,
        {},
        { ...settings, swatchSource: 'property', swatchProperty: 'hex' }
      );

      expect(color.values[0].swatch).toEqual({ color: '#ff0000' });
      expect(color.values[1].swatch).toEqual({ imageUrl: 'https://img/blue.png' });
    });

    it('does not mark sold out values when switched off', () => {
      const [color] = decorateRows(rows, variants, {}, { ...settings, soldOut: 'none' });

      expect(color.values.some(value => value.soldOut)).toBe(false);
    });

    it('hides values that are sold out in every combination but keeps the selected one', () => {
      const selectedRows = rows.map(row => ({
        ...row,
        values: row.values.map(value => ({ ...value, selected: value.id === 'red' })),
      }));
      const [color, size] = decorateRows(
        selectedRows,
        variants,
        { color: 'red' },
        { ...settings, soldOut: 'hide' }
      );

      expect(labels(size.values)).toEqual(['S']);
      expect(labels(color.values)).toEqual(['Red', 'Blue']);
    });

    it('hides a sold out value that is not selected', () => {
      const [color] = decorateRows(rows, variants, {}, { ...settings, soldOut: 'hide' });

      expect(labels(color.values)).toEqual(['Blue']);
    });
  });
});
