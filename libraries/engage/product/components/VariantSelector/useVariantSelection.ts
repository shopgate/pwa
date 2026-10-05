import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import isEqual from 'lodash/isEqual';
import isMatch from 'lodash/isMatch';
import * as helpers from '../ProductCharacteristics/helpers';
import { applySelection, buildRows, orderSelection } from './selection';
import type {
  ProductVariants,
  VariantCharacteristic,
  VariantSelection,
  VariantSelectionChange,
  VariantSelectorRow,
} from './types';

const selectCharacteristics = helpers.selectCharacteristics as unknown as (input: {
  variantId: string | null;
  variants: ProductVariants | null;
}) => VariantSelection;

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
    () => orderSelection(selectCharacteristics({ variantId, variants }), variants)
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
    const initial = orderSelection(selectCharacteristics({ variantId, variants }), variants);
    setSelection(initial);
    callbacksRef.current.onCharacteristicsChange?.(initial);
    setCheckRequest(value => value + 1);
  }, [variants, variantId]);

  useEffect(() => {
    if (characteristics && !isEqual(characteristics, selection)) {
      setSelection(orderSelection(characteristics, variants));
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

    const next = applySelection(variants, selection, id, value);

    setSelection(next);
    callbacksRef.current.onCharacteristicsChange?.(next);
    setCheckRequest(current => current + 1);
  }, [selection, variants]);

  const rows = useMemo<VariantSelectorRow[]>(
    () => (variants ? buildRows(variants, selection) : []),
    [selection, variants]
  );

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
