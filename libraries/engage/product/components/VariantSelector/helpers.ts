import isMatch from 'lodash/isMatch';
import type { VariantSelectorSettings } from '../../hooks/useVariantSelectorSettings';
import type {
  ProductVariants,
  VariantProduct,
  VariantRendererType,
  VariantSelection,
  VariantSelectorRow,
  VariantSelectorValue,
  VariantSwatchData,
} from './types';

const LETTER_SIZE = /^(\d)?(X*)(S|M|L)$/;
const NUMERIC_SIZE = /^W?(\d+(?:[.,]\d+)?)(?:\s*[/-]\s*L?(\d+(?:[.,]\d+)?))?$/;

/**
 * Returns a sort rank for letter sizes like XS, M, XXL or 3XL.
 * @param label The value label.
 * @returns The rank or null when the label is no letter size.
 */
const getLetterSizeRank = (label: string): number | null => {
  const match = label.trim().toUpperCase().match(LETTER_SIZE);

  if (!match) {
    return null;
  }

  const [, digit, xs, base] = match;

  if (digit && xs.length !== 1) {
    return null;
  }

  const count = digit ? parseInt(digit, 10) : xs.length;

  if (base === 'M') {
    return count === 0 ? 0 : null;
  }

  return base === 'L' ? 1 + count : -(1 + count);
};

/**
 * Returns sort keys for numeric sizes like 38, 38.5, 38/40 or W32/L34.
 * @param label The value label.
 * @returns The keys or null when the label is no numeric size.
 */
const getNumericSizeKeys = (label: string): [number, number] | null => {
  const match = label.trim().toUpperCase().match(NUMERIC_SIZE);

  if (!match) {
    return null;
  }

  const toNumber = (value?: string) => (value ? parseFloat(value.replace(',', '.')) : 0);

  return [toNumber(match[1]), toNumber(match[2])];
};

/**
 * Sorts values from small to large when every label is a letter size or every label is a
 * numeric size. Other values keep their order.
 * @param values The characteristic values.
 * @returns The sorted values.
 */
export const sortSizeValues = <T extends { label: string }>(values: T[]): T[] => {
  const letterRanks = values.map(value => getLetterSizeRank(value.label));

  if (values.length > 1 && letterRanks.every(rank => rank !== null)) {
    return values
      .map((value, index) => ({ value, rank: letterRanks[index] as number, index }))
      .sort((a, b) => (a.rank - b.rank) || (a.index - b.index))
      .map(({ value }) => value);
  }

  const numericKeys = values.map(value => getNumericSizeKeys(value.label));

  if (values.length > 1 && numericKeys.every(keys => keys !== null)) {
    return values
      .map((value, index) => ({ value, keys: numericKeys[index] as [number, number], index }))
      .sort((a, b) => (a.keys[0] - b.keys[0]) || (a.keys[1] - b.keys[1]) || (a.index - b.index))
      .map(({ value }) => value);
  }

  return values;
};

/**
 * Whether a variant can not be ordered because it is out of stock.
 * @param product The variant product.
 * @returns Whether the variant is sold out.
 */
export const isVariantSoldOut = (product: VariantProduct): boolean => {
  const { stock } = product;

  if (!stock) {
    return false;
  }

  return stock.orderable === false || (stock.ignoreQuantity === false && stock.quantity === 0);
};

/**
 * Returns the variants that match the selection of the characteristics before the given index
 * and the given value.
 * @param variants The variants.
 * @param selection The current selection.
 * @param rowIndex The index of the characteristic.
 * @param valueId The value ID.
 * @returns The matching variants.
 */
const getMatchingVariants = (
  variants: ProductVariants,
  selection: VariantSelection,
  rowIndex: number,
  valueId: string
): VariantProduct[] => {
  const subset: VariantSelection = {};

  variants.characteristics.slice(0, rowIndex).forEach((char) => {
    if (selection[char.id]) {
      subset[char.id] = selection[char.id];
    }
  });

  subset[variants.characteristics[rowIndex].id] = valueId;

  return variants.products.filter(product => isMatch(product.characteristics, subset));
};

/**
 * Resolves the swatch of a value.
 * @param value The value.
 * @param matching The variants with this value.
 * @param source The configured swatch source.
 * @returns The swatch or undefined.
 */
const resolveSwatch = (
  value: VariantSelectorValue,
  matching: VariantProduct[],
  source: VariantSelectorSettings['swatchSource']
): VariantSwatchData | undefined => {
  if (value.swatch?.color || value.swatch?.imageUrl) {
    return value.swatch;
  }

  if (source !== 'variantImage') {
    return undefined;
  }

  const image = matching.find(product => product.featuredImageBaseUrl || product.featuredImageUrl);
  const imageUrl = image?.featuredImageBaseUrl || image?.featuredImageUrl;

  return imageUrl ? { imageUrl } : undefined;
};

/**
 * Resolves the display type of a characteristic.
 * @param row The characteristic row.
 * @param settings The variant selector settings.
 * @param isBetaSwatch Whether the legacy beta swatches apply.
 * @returns The display type.
 */
export const resolveRendererType = (
  row: VariantSelectorRow,
  settings: Pick<VariantSelectorSettings, 'type' | 'swatchCharacteristics' | 'chipCharacteristics'>,
  isBetaSwatch: boolean
): VariantRendererType => {
  const label = row.label.trim().toLowerCase();

  if (settings.swatchCharacteristics.includes(label)) {
    return 'swatches';
  }

  if (settings.chipCharacteristics.includes(label)) {
    return 'chips';
  }

  if (row.swatch && isBetaSwatch) {
    return 'swatches';
  }

  return settings.type;
};

/**
 * Adds sold out state and swatches to the rows and sorts size values.
 * @param rows The rows from the selection.
 * @param variants The variants.
 * @param selection The current selection.
 * @param settings The variant selector settings.
 * @returns The decorated rows.
 */
export const decorateRows = (
  rows: VariantSelectorRow[],
  variants: ProductVariants,
  selection: VariantSelection,
  settings: Pick<VariantSelectorSettings, 'sortSizes' | 'soldOut' | 'swatchSource'>
): VariantSelectorRow[] => rows.map((row, rowIndex) => {
  const values = row.values.map((value) => {
    const matching = getMatchingVariants(variants, selection, rowIndex, value.id);

    return {
      ...value,
      soldOut: matching.length > 0 && matching.every(isVariantSoldOut),
      swatch: resolveSwatch(value, matching, settings.swatchSource),
    };
  });

  const visible = settings.soldOut === 'hide'
    ? values.filter(value => !value.soldOut || value.selected)
    : values;

  return {
    ...row,
    values: settings.sortSizes ? sortSizeValues(visible) : visible,
  };
});
