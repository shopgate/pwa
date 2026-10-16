import isMatch from 'lodash/isMatch';
import type {
  ProductVariants,
  VariantProduct,
  VariantSelection,
  VariantSelectorRow,
} from './types';

/**
 * Orders a selection like the characteristics of the variants.
 * @param selection The selection.
 * @param variants The variants.
 * @returns The ordered selection.
 */
export const orderSelection = (
  selection: VariantSelection,
  variants: ProductVariants | null
): VariantSelection => {
  if (!variants) {
    return selection;
  }

  const ordered: VariantSelection = {};

  variants.characteristics.forEach(({ id }) => {
    if (selection[id]) {
      ordered[id] = selection[id];
    }
  });

  return ordered;
};

/**
 * Selects the value of every characteristic that has only one value.
 * @param selection The selection.
 * @param variants The variants.
 * @returns The completed selection.
 */
export const selectSingleValues = (
  selection: VariantSelection,
  variants: ProductVariants | null
): VariantSelection => {
  if (!variants) {
    return selection;
  }

  const completed = { ...selection };

  variants.characteristics.forEach(({ id, values }) => {
    if (!completed[id] && values.length === 1) {
      completed[id] = values[0].id;
    }
  });

  return orderSelection(completed, variants);
};

/**
 * Returns the variants that match a selection.
 * @param variants The variants.
 * @param selection The selection.
 * @returns The matching variants.
 */
export const findMatchingVariants = (
  variants: ProductVariants,
  selection: VariantSelection
): VariantProduct[] => variants.products.filter(product => (
  isMatch(product.characteristics, selection)
));

/**
 * Returns the selection of all characteristics except the given one.
 * @param selection The selection.
 * @param charId The characteristic to leave out.
 * @returns The remaining selection.
 */
export const getOtherSelections = (
  selection: VariantSelection,
  charId: string
): VariantSelection => {
  const others = { ...selection };
  delete others[charId];
  return others;
};

/**
 * Applies a selected value. Other selected values are kept as long as a variant exists for the
 * combination, the first characteristics win. When only one variant is left, its characteristics
 * are selected.
 * @param variants The variants.
 * @param selection The current selection.
 * @param charId The characteristic.
 * @param valueId The selected value.
 * @returns The new selection.
 */
export const applySelection = (
  variants: ProductVariants,
  selection: VariantSelection,
  charId: string,
  valueId: string
): VariantSelection => {
  let next: VariantSelection = { [charId]: valueId };

  variants.characteristics.forEach(({ id }) => {
    if (id === charId || !selection[id]) {
      return;
    }

    const candidate = {
      ...next,
      [id]: selection[id],
    };

    if (findMatchingVariants(variants, candidate).length > 0) {
      next = candidate;
    }
  });

  const completed = selectSingleValues(next, variants);
  const matching = findMatchingVariants(variants, completed);

  if (matching.length === 1) {
    return orderSelection(matching[0].characteristics, variants);
  }

  return completed;
};

/**
 * Builds the rows of the selector. Every value can be selected, values without a variant for the
 * other selected values are marked as unavailable.
 * @param variants The variants.
 * @param selection The current selection.
 * @returns The rows.
 */
export const buildRows = (
  variants: ProductVariants,
  selection: VariantSelection
): VariantSelectorRow[] => variants.characteristics.map((char) => {
  const others = getOtherSelections(selection, char.id);
  const selected = selection[char.id] || null;

  return {
    id: char.id,
    label: String(char.label ?? ''),
    disabled: false,
    selected,
    swatch: !!char.swatch,
    values: (char.values || []).map(value => ({
      ...value,
      label: String(value.label ?? ''),
      selectable: true,
      selected: selected === value.id,
      available: findMatchingVariants(variants, {
        ...others,
        [char.id]: value.id,
      }).length > 0,
    })),
  };
});
