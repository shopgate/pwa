import { getFullImageSource } from '@shopgate/engage/core/helpers/getFullImageSource';
import type { VariantSelectorSettings } from '../../hooks/useVariantSelectorSettings';
import { findMatchingVariants, getOtherSelections } from './selection';
import type {
  ProductVariants,
  VariantProduct,
  VariantRendererType,
  VariantSelection,
  VariantSelectorRow,
  VariantSelectorValue,
  VariantSwatchData,
} from './types';

const SWATCH_IMAGE_SIZE = 120;
const SWATCH_IMAGE_MAX_SIZE = 600;

const LETTER_SIZE = /^(\d)?(X*)(S|M|L)$/;
const NUMERIC_SIZE = /^W?(\d+(?:[.,]\d+)?)(?:\s*[/-]\s*L?(\d+(?:[.,]\d+)?))?$/;

/**
 * Returns a sort rank for letter sizes like XS, M, XXL or 3XL.
 * @param label The value label.
 * @returns The rank or null when the label is no letter size.
 */
const getLetterSizeRank = (label: string): number | null => {
  const match = String(label ?? '').trim().toUpperCase().match(LETTER_SIZE);

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
  const match = String(label ?? '').trim().toUpperCase().match(NUMERIC_SIZE);

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
      .map((value, index) => ({
        value,
        rank: letterRanks[index] as number,
        index,
      }))
      .sort((a, b) => (a.rank - b.rank) || (a.index - b.index))
      .map(({ value }) => value);
  }

  const numericKeys = values.map(value => getNumericSizeKeys(value.label));

  if (values.length > 1 && numericKeys.every(keys => keys !== null)) {
    return values
      .map((value, index) => ({
        value,
        keys: numericKeys[index] as [number, number],
        index,
      }))
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

  return stock.orderable === false
    || (stock.ignoreQuantity === false && typeof stock.quantity === 'number' && stock.quantity <= 0);
};

const IMAGE_URL = /^(https?:)?\/\/[^\s"\\]+$/i;
const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/**
 * Whether a value is a CSS color.
 * @param value The value.
 * @returns Whether the value is a color.
 */
const isColor = (value: string): boolean => (
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
    ? CSS.supports('color', value)
    : HEX_COLOR.test(value)
);

/**
 * Turns a property value into a swatch when it is a CSS color or an image URL.
 * @param value The property value.
 * @returns The swatch or undefined.
 */
const toSwatch = (value: unknown): VariantSwatchData | undefined => {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }

  const trimmed = value.trim();

  if (IMAGE_URL.test(trimmed)) {
    return { imageUrl: trimmed };
  }

  return isColor(trimmed) ? { color: trimmed } : undefined;
};

/**
 * Keeps the color or image of a swatch from the variants pipeline when it can be rendered.
 * @param swatch The swatch of a value.
 * @returns The swatch or undefined.
 */
const toPipelineSwatch = (swatch?: VariantSwatchData): VariantSwatchData | undefined => {
  const color = typeof swatch?.color === 'string' ? swatch.color.trim() : '';
  const imageUrl = typeof swatch?.imageUrl === 'string' ? swatch.imageUrl.trim() : '';

  if (imageUrl && IMAGE_URL.test(imageUrl)) {
    return { imageUrl };
  }

  return color && isColor(color) ? { color } : undefined;
};

/**
 * Reads a swatch from a product property of the variants.
 * @param matching The variants with the value.
 * @param property Label or code of the property.
 * @returns The swatch or undefined.
 */
const getPropertySwatch = (
  matching: VariantProduct[],
  property: string
): VariantSwatchData | undefined => {
  const name = property.trim().toLowerCase();

  if (!name) {
    return undefined;
  }

  for (let i = 0; i < matching.length; i += 1) {
    const entry = (matching[i].properties || []).find(prop => (
      prop.label?.trim().toLowerCase() === name || prop.code?.trim().toLowerCase() === name
    ));
    const swatch = toSwatch(entry?.value);

    if (swatch) {
      return swatch;
    }
  }

  return undefined;
};

/**
 * Reads the featured image of the variants as swatch.
 * @param matching The variants with the value.
 * @param zoom The zoom of image swatches in percent.
 * @returns The swatch or undefined.
 */
const getImageSwatch = (
  matching: VariantProduct[],
  zoom: number
): VariantSwatchData | undefined => {
  const product = matching.find(entry => entry.featuredImageBaseUrl || entry.featuredImageUrl);

  if (product?.featuredImageBaseUrl) {
    const size = Math.min(
      SWATCH_IMAGE_MAX_SIZE,
      Math.round(SWATCH_IMAGE_SIZE * Math.max(1, zoom / 100))
    );

    return {
      imageUrl: getFullImageSource(product.featuredImageBaseUrl, {
        width: size,
        height: size,
      }),
    };
  }

  return product?.featuredImageUrl ? { imageUrl: product.featuredImageUrl } : undefined;
};

/**
 * Resolves the swatch of a value from the configured source. Falls back to a swatch that the
 * variants pipeline delivers for the value.
 * @param value The value.
 * @param matching The variants with this value.
 * @param settings The swatch settings.
 * @param configured Whether swatches are configured for the characteristic.
 * @returns The swatch or undefined.
 */
const resolveSwatch = (
  value: VariantSelectorValue,
  matching: VariantProduct[],
  settings: Pick<VariantSelectorSettings, 'swatchSource' | 'swatchProperty' | 'swatchImageZoom'>,
  configured: boolean
): VariantSwatchData | undefined => {
  const pipelineSwatch = toPipelineSwatch(value.swatch);

  if (!configured) {
    return pipelineSwatch;
  }

  const fromSource = settings.swatchSource === 'property'
    ? getPropertySwatch(matching, settings.swatchProperty)
    : getImageSwatch(matching, settings.swatchImageZoom);

  return fromSource || pipelineSwatch;
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
  settings: Pick<VariantSelectorSettings, 'type' | 'swatchCharacteristics'>,
  isBetaSwatch: boolean
): VariantRendererType => {
  const label = row.label.trim().toLowerCase();

  if (settings.swatchCharacteristics.includes(label)) {
    return 'swatches';
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
  settings: Pick<
    VariantSelectorSettings,
    'soldOut' | 'swatchSource' | 'swatchProperty' | 'swatchImageZoom' | 'swatchCharacteristics'
  >
): VariantSelectorRow[] => rows.map((row) => {
  const others = getOtherSelections(selection, row.id);
  const configured = settings.swatchCharacteristics.includes(row.label.trim().toLowerCase());
  const values = row.values.map((value) => {
    const withValue = findMatchingVariants(variants, { [row.id]: value.id });
    const matching = findMatchingVariants(variants, {
      ...others,
      [row.id]: value.id,
    });
    const soldOut = matching.length > 0 && matching.every(isVariantSoldOut);
    const soldOutEverywhere = withValue.length > 0 && withValue.every(isVariantSoldOut);

    return {
      value: {
        ...value,
        soldOut: settings.soldOut === 'strike' && soldOut,
        swatch: resolveSwatch(value, withValue, settings, configured),
      },
      hidden: settings.soldOut === 'hide' && soldOutEverywhere && !value.selected,
    };
  });

  const visible = values.filter(({ hidden }) => !hidden).map(({ value }) => value);

  return {
    ...row,
    values: sortSizeValues(visible.length > 0 ? visible : values.map(({ value }) => ({
      ...value,
      soldOut: true,
    }))),
  };
});

/**
 * Preselects the first combination that is not sold out, following the displayed order of the
 * values. Falls back to the first existing combination when every variant is sold out.
 * @param variants The variants.
 * @returns The selection.
 */
export const preselectFirstAvailable = (variants: ProductVariants): VariantSelection => {
  /**
   * Picks the first value per characteristic that still has a matching variant.
   * @param accept Whether a matching variant qualifies.
   * @returns The selection.
   */
  const pick = (accept: (product: VariantProduct) => boolean): VariantSelection => (
    variants.characteristics.reduce<VariantSelection>((selection, char) => {
      const value = sortSizeValues(char.values).find(candidate => (
        findMatchingVariants(variants, {
          ...selection,
          [char.id]: candidate.id,
        }).some(accept)
      ));

      return value ? {
        ...selection,
        [char.id]: value.id,
      } : selection;
    }, {})
  );

  const available = pick(product => !isVariantSoldOut(product));

  return Object.keys(available).length === variants.characteristics.length
    ? available
    : pick(() => true);
};
