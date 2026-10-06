import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import isEqual from 'lodash/isEqual';
import isMatch from 'lodash/isMatch';
import {
  applySelection, buildRows, orderSelection, selectSingleValues,
} from './selection';
import { preselectFirstAvailable } from './helpers';
import type {
  ProductVariants,
  VariantCharacteristic,
  VariantSelection,
  VariantSelectionChange,
  VariantSelectorRow,
} from './types';

/**
 * Builds the selection a product page starts with.
 * @param variants The variants.
 * @param variantId The shown variant.
 * @param preselect Whether the first available variant is preselected.
 * @returns The selection.
 */
const getInitialSelection = (
  variants: ProductVariants | null,
  variantId: string | null,
  preselect: boolean
): VariantSelection => {
  if (!variants || !variants.products.length) {
    return {};
  }

  const variant = variantId ? variants.products.find(product => product.id === variantId) : null;

  if (variant) {
    return orderSelection(variant.characteristics, variants);
  }

  if (variants.products.length === 1) {
    return orderSelection(variants.products[0].characteristics, variants);
  }

  return selectSingleValues(preselect ? preselectFirstAvailable(variants) : {}, variants);
};

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
  /** Whether the first available variant is preselected. */
  preselect?: boolean;
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
 * @param options.preselect Whether the first variant is preselected.
 * @returns The selection state and handlers.
 */
const useVariantSelection = ({
  variants,
  variantId = null,
  characteristics = null,
  onCharacteristicsChange,
  onVariantSelected,
  finishTimeout = 0,
  preselect = false,
}: UseVariantSelectionOptions): UseVariantSelectionResult => {
  const [selection, setSelection] = useState<VariantSelection>(
    () => getInitialSelection(variants, variantId, preselect)
  );
  const [checkRequest, setCheckRequest] = useState(0);
  const initializedRef = useRef(!!variants);
  const callbacksRef = useRef({
    onCharacteristicsChange,
    onVariantSelected,
  });
  callbacksRef.current = {
    onCharacteristicsChange,
    onVariantSelected,
  };

  const initialSelectionRef = useRef(selection);

  useEffect(() => {
    callbacksRef.current.onCharacteristicsChange?.(initialSelectionRef.current);
    setCheckRequest(value => value + 1);
  }, []);

  useEffect(() => {
    if (initializedRef.current || !variants) {
      return;
    }

    initializedRef.current = true;
    const initial = getInitialSelection(variants, variantId, preselect);
    setSelection(initial);
    callbacksRef.current.onCharacteristicsChange?.(initial);
    setCheckRequest(value => value + 1);
  }, [variants, variantId, preselect]);

  useEffect(() => {
    if (!characteristics) {
      return;
    }

    setSelection(current => (
      isEqual(characteristics, current) ? current : orderSelection(characteristics, variants)
    ));
  }, [characteristics, variants]);

  const isComplete = !!variants && Object.values(selection)
    .filter(Boolean).length === variants.characteristics.length;

  const checkStateRef = useRef({
    variants,
    selection,
    variantId,
    isComplete,
    finishTimeout,
  });
  checkStateRef.current = {
    variants,
    selection,
    variantId,
    isComplete,
    finishTimeout,
  };

  useEffect(() => {
    const {
      variants: currentVariants,
      selection: currentSelection,
      variantId: currentVariantId,
      isComplete: complete,
      finishTimeout: timeoutMs,
    } = checkStateRef.current;

    if (!checkRequest || !currentVariants || !complete) {
      return undefined;
    }

    const match = currentVariants.products.find(product => (
      isMatch(product.characteristics, currentSelection)
    ));

    if (!match || match.id === currentVariantId) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      callbacksRef.current.onVariantSelected?.(match.id);
    }, timeoutMs);

    return () => clearTimeout(timeout);
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
