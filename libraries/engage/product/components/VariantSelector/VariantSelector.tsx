import React, {
  createRef, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { isBeta } from '@shopgate/engage/core/helpers';
import { Portal } from '@shopgate/engage/components';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import * as productSelectors from '@shopgate/pwa-common-commerce/product/selectors/product';
import { PRODUCT_VARIANT_SELECT_CHARACTERISTIC } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import VariantContext from '../ProductCharacteristics/context';
import useVariantSelectorSettings from '../../hooks/useVariantSelectorSettings';
import Characteristic from '../Characteristics/Characteristic';
import VariantSelectorSkeleton from './VariantSelectorSkeleton';
import VariantChips from './renderers/VariantChips';
import VariantSwatches from './renderers/VariantSwatches';
import VariantInlineDropdown from './renderers/VariantInlineDropdown';
import SelectedVariantInfo from './renderers/SelectedVariantInfo';
import useVariantSelection from './useVariantSelection';
import usePrefetchVariants from './usePrefetchVariants';
import { getVariantRenderer } from './registry';
import { decorateRows, resolveRendererType } from './helpers';
import type {
  ProductVariants,
  VariantRendererProps,
  VariantSelection,
} from './types';

const CONDITIONER_NAME = 'product-variants';

type ProductSelector<T> = (state: unknown, props: { productId: string | null }) => T;

const getProductVariants =
  productSelectors.getProductVariants as unknown as ProductSelector<ProductVariants | null>;
const hasProductVariants =
  productSelectors.hasProductVariants as unknown as ProductSelector<boolean | null>;
const getBaseProductId =
  productSelectors.getBaseProductId as unknown as ProductSelector<string | null>;
const getProductVariantsState =
  productSelectors.getProductVariantsState as unknown as (
    state: unknown
  ) => Record<string, { isFetching?: boolean } | undefined>;

/**
 * Whether the variants of a variant product are still expected to arrive.
 * @param state The application state.
 * @param props The selector props.
 * @param props.productId The ID of the base product.
 * @returns Whether the variants are loading.
 */
const getAreVariantsLoading = (state: unknown, { productId }: { productId: string | null }) => {
  if (!hasProductVariants(state, { productId })) {
    return false;
  }

  const baseProductId = getBaseProductId(state, { productId });
  const entry = baseProductId ? getProductVariantsState(state)[baseProductId] : undefined;

  return !entry || !!entry.isFetching;
};
const announce = broadcastLiveMessage as unknown as (
  message: string,
  options: { params: Record<string, string> }
) => void;

const DEFAULT_RENDERERS: Record<string, React.ComponentType<VariantRendererProps>> = {
  dropdown: Characteristic as unknown as React.ComponentType<VariantRendererProps>,
  chips: VariantChips,
  swatches: VariantSwatches,
  inlineDropdown: VariantInlineDropdown,
};

interface Conditioner {
  addConditioner: (name: string, fn: () => boolean) => unknown;
  removeConditioner: (name: string) => unknown;
}

export interface VariantSelectorProps {
  /** ID of the base product. */
  productId: string | null;
  /** ID of the currently shown variant. */
  variantId?: string | null;
  /** Called with the variant ID once the selection matches a variant. */
  onVariantSelected?: (variantId: string) => void;
  /** Delay in ms before `onVariantSelected` is called. */
  finishTimeout?: number;
  /** Conditioner that blocks add to cart until every characteristic is selected. */
  conditioner?: Conditioner | null;
  /** Selection kept outside of the selector, e.g. in the product context. */
  characteristics?: VariantSelection | null;
  /** Called whenever the selection changes. */
  onCharacteristicsChange?: (selection: VariantSelection) => void;
  /** Renders dropdowns as chips, e.g. inside a sheet. */
  compact?: boolean;
}

/**
 * Renders the characteristics of a product and resolves the selected variant.
 * @param props The component props.
 * @returns The variant selector.
 */
const VariantSelector = ({
  productId,
  variantId = null,
  onVariantSelected,
  finishTimeout = 0,
  conditioner = null,
  characteristics = null,
  onCharacteristicsChange,
  compact = false,
}: VariantSelectorProps) => {
  const variants = useSelector((state: unknown) => getProductVariants(state, { productId }));
  const isLoading = useSelector((state: unknown) => getAreVariantsLoading(state, { productId }));
  const [highlight, setHighlight] = useState<string | null>(null);
  const settings = useVariantSelectorSettings();

  const {
    rows, selection, isComplete, select, findFirstUnselected,
  } = useVariantSelection({
    variants,
    variantId,
    characteristics,
    onCharacteristicsChange,
    onVariantSelected,
    finishTimeout,
    preselect: settings.preselect === 'inherit' ? undefined : settings.preselect === 'on',
  });

  usePrefetchVariants(variants, selection);

  const refs = useMemo(() => {
    const map: Record<string, React.RefObject<HTMLElement>> = {};
    variants?.characteristics.forEach((char) => {
      map[char.id] = createRef<HTMLElement>();
    });
    return map;
  }, [variants]);

  const checkSelection = useCallback(() => {
    if (!variants) {
      return true;
    }

    if (isComplete && variantId) {
      return true;
    }

    const firstUnselected = findFirstUnselected();
    const element = firstUnselected ? refs[firstUnselected.id]?.current : null;

    if (firstUnselected && element) {
      element.focus();
      announce('product.pick_option_first', {
        params: { option: element.innerText },
      });

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setHighlight(null);
      requestAnimationFrame(() => setHighlight(firstUnselected.id));
    }

    return false;
  }, [findFirstUnselected, isComplete, refs, variantId, variants]);

  const checkSelectionRef = useRef(checkSelection);
  checkSelectionRef.current = checkSelection;

  useEffect(() => {
    if (!conditioner) {
      return undefined;
    }

    conditioner.addConditioner(CONDITIONER_NAME, () => checkSelectionRef.current());

    return () => {
      conditioner.removeConditioner(CONDITIONER_NAME);
    };
  }, [conditioner]);

  const resetHighlight = useCallback(() => setHighlight(null), []);

  const handleSelect = useCallback<VariantRendererProps['select']>((change) => {
    setHighlight(null);
    select(change);
  }, [select]);

  const contextValue = useMemo(() => ({
    characteristics: selection,
    highlight,
  }), [highlight, selection]);

  const displayRows = useMemo(() => {
    if (!variants) {
      return [];
    }

    const isBetaSwatch = isBeta();

    return decorateRows(rows, variants, selection, settings).map((row) => {
      const type = resolveRendererType(row, settings, isBetaSwatch);

      return {
        row,
        type: compact && type === 'dropdown' ? 'inlineDropdown' : type,
      };
    });
  }, [compact, rows, selection, settings, variants]);

  if (!variants) {
    return isLoading ? <VariantSelectorSkeleton /> : null;
  }

  const lastType = displayRows[displayRows.length - 1]?.type;

  return (
    <VariantContext.Provider value={contextValue}>
      {displayRows.map(({ row, type }) => {
        const Renderer = getVariantRenderer(type)
          ?? DEFAULT_RENDERERS[type]
          ?? DEFAULT_RENDERERS.dropdown;

        return (
          <Portal
            key={row.id}
            name={PRODUCT_VARIANT_SELECT_CHARACTERISTIC}
            props={{
              characteristic: row,
              type,
              select: handleSelect,
            }}
          >
            <Renderer
              charRef={refs[row.id]}
              disabled={row.disabled}
              highlight={highlight === row.id}
              id={row.id}
              label={row.label}
              selected={row.selected}
              swatch={row.swatch}
              values={row.values}
              select={handleSelect}
              resetHighlight={resetHighlight}
              chipsLayout={settings.chipsLayout}
              swatchShape={settings.swatchShape}
              swatchImageZoom={settings.swatchImageZoom}
            />
          </Portal>
        );
      })}
      {isComplete && lastType !== 'dropdown' && (
        <SelectedVariantInfo productId={productId} selection={selection} />
      )}
    </VariantContext.Provider>
  );
};

export default VariantSelector;
