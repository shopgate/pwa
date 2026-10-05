import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import isEqual from 'lodash/isEqual';
import isMatch from 'lodash/isMatch';
import * as helpers from '../ProductCharacteristics/helpers';
import type {
  ProductVariants,
  VariantCharacteristic,
  VariantCharacteristicValue,
  VariantProduct,
  VariantSelection,
  VariantSelectionChange,
  VariantSelectorRow,
  VariantSelectorValue,
} from './types';

const selectCharacteristics = helpers.selectCharacteristics as unknown as (input: {
  variantId: string | null;
  variants: ProductVariants | null;
}) => VariantSelection;

const prepareState = helpers.prepareState as unknown as (
  id: string,
  value: string,
  selections: VariantSelection,
  characteristics: VariantCharacteristic[],
  products: VariantProduct[]
) => VariantSelection;

const buildValues = helpers.buildValues as unknown as (
  selections: VariantSelection,
  charId: string,
  values: VariantCharacteristicValue[],
  charIndex: number,
  selectedValue: string | null,
  charDisabled: boolean,
  products: VariantProduct[]
) => VariantSelectorValue[];

const isCharacteristicEnabled = helpers.isCharacteristicEnabled as unknown as (
  selections: VariantSelection,
  index: number
) => boolean;

const getSelectedValue = helpers.getSelectedValue as unknown as (
  charId: string,
  selections: VariantSelection
) => string | null;

export interface UseVariantSelectionOptions {
  /** Variants of the base product, `null` while they are not loaded. */
  variants: ProductVariants | null;
  /** The currently shown variant. */
  variantId?: string | null;
  /** Selection kept outside of the hook, e.g. in the product context. */
  characteristics?: VariantSelection | null;
  /** Called whenever the selection changes. */
  onCharacteristicsChange?: (selection: VariantSelection) => void;
  /** Called with the variant ID once the selection matches a variant. */
  onVariantSelected?: (variantId: string) => void;
  /** Delay in ms before `onVariantSelected` is called. */
  finishTimeout?: number;
}

export interface UseVariantSelectionResult {
  /** The characteristics prepared for rendering. */
  rows: VariantSelectorRow[];
  /** The current selection. */
  selection: VariantSelection;
  /** Whether a value is selected for every characteristic. */
  isComplete: boolean;
  /** Selects a value of a characteristic. */
  select: (change: VariantSelectionChange) => void;
  /** Returns the first characteristic without a selected value. */
  findFirstUnselected: () => VariantCharacteristic | null;
}

/**
 * Holds the variant selection of a product: preselection, dependent characteristics and
 * resolving the selected variant.
 * @param options The hook options.
 * @param options.variants Variants of the base product.
 * @param options.variantId The currently shown variant.
 * @param options.characteristics Selection kept outside of the hook.
 * @param options.onCharacteristicsChange Called whenever the selection changes.
 * @param options.onVariantSelected Called once the selection matches a variant.
 * @param options.finishTimeout Delay before `onVariantSelected` is called.
 * @returns The selection state and handlers.
 */
const useVariantSelection = ({
  variants,
  variantId = null,
  characteristics = null,
  onCharacteristicsChange,
  onVariantSelected,
  finishTimeout = 0,
}: UseVariantSelectionOptions): UseVariantSelectionResult => {
  const [selection, setSelection] = useState<VariantSelection>(
    () => selectCharacteristics({ variantId, variants })
  );
  const [checkRequest, setCheckRequest] = useState(0);
  const initializedRef = useRef(!!variants);
  const callbacksRef = useRef({ onCharacteristicsChange, onVariantSelected });
  callbacksRef.current = { onCharacteristicsChange, onVariantSelected };

  useEffect(() => {
    callbacksRef.current.onCharacteristicsChange?.(selection);
    setCheckRequest(value => value + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initializedRef.current || !variants) {
      return;
    }

    initializedRef.current = true;
    const initial = selectCharacteristics({ variantId, variants });
    setSelection(initial);
    callbacksRef.current.onCharacteristicsChange?.(initial);
    setCheckRequest(value => value + 1);
  }, [variants, variantId]);

  useEffect(() => {
    if (characteristics && !isEqual(characteristics, selection)) {
      setSelection(characteristics);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characteristics]);

  const isComplete = !!variants && Object.values(selection)
    .filter(Boolean).length === variants.characteristics.length;

  useEffect(() => {
    if (!checkRequest || !variants || !isComplete) {
      return undefined;
    }

    const match = variants.products.find(product => (
      isMatch(product.characteristics, selection)
    ));

    if (!match || match.id === variantId) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      callbacksRef.current.onVariantSelected?.(match.id);
    }, finishTimeout);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkRequest]);

  const select = useCallback(({ id, value }: VariantSelectionChange) => {
    if (!variants) {
      return;
    }

    const next = prepareState(
      id,
      value,
      selection,
      variants.characteristics,
      variants.products
    );

    setSelection({ ...next });
    callbacksRef.current.onCharacteristicsChange?.({ ...next });
    setCheckRequest(current => current + 1);
  }, [selection, variants]);

  const rows = useMemo<VariantSelectorRow[]>(() => {
    if (!variants) {
      return [];
    }

    return variants.characteristics.map((char, index) => {
      const disabled = !isCharacteristicEnabled(selection, index);
      const selected = getSelectedValue(char.id, selection);

      return {
        id: char.id,
        label: char.label,
        disabled,
        selected,
        swatch: !!char.swatch,
        values: buildValues(
          selection,
          char.id,
          char.values,
          index,
          selected,
          disabled,
          variants.products
        ),
      };
    });
  }, [selection, variants]);

  const findFirstUnselected = useCallback(() => {
    if (!variants) {
      return null;
    }

    return variants.characteristics.find(char => !selection[char.id]) ?? null;
  }, [selection, variants]);

  return {
    rows,
    selection,
    isComplete,
    select,
    findFirstUnselected,
  };
};

export default useVariantSelection;
