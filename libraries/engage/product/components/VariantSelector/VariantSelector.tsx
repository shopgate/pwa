import {
  createRef, useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type RefObject,
} from 'react';
import { useSelector } from 'react-redux';
import { isBeta } from '@shopgate/engage/core/helpers';
import { SurroundPortals } from '@shopgate/engage/components';
import { broadcastLiveMessage } from '@shopgate/engage/a11y/helpers';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import isMatch from 'lodash/isMatch';
import uniqueId from 'lodash/uniqueId';
import { PRODUCT_VARIANT_SELECT_CHARACTERISTIC } from '@shopgate/engage/product/constants';
import { useVariantSelectorSettings } from '@shopgate/engage/product/hooks';
import {
  getBaseProductId,
  getProduct,
  getProductVariants,
  getProductVariantsState,
  hasProductVariants,
} from '../../selectors/catalog';
import VariantContext from '../ProductCharacteristics/context';
import Characteristic from '../Characteristics/Characteristic';
import VariantSelectorSkeleton from './VariantSelectorSkeleton';
import VariantChips from './renderers/VariantChips';
import VariantSwatches from './renderers/VariantSwatches';
import VariantInlineDropdown from './renderers/VariantInlineDropdown';
import SelectedVariantInfo from './renderers/SelectedVariantInfo';
import useVariantSelection from './useVariantSelection';
import usePrefetchVariants from './usePrefetchVariants';
import { decorateRows, resolveRendererType } from './helpers';
import type {
  VariantRendererProps,
  VariantSelection,
} from './types';

const CONDITIONER_NAME = 'product-variants';
const ANNOUNCE_DELAY = 150;

/**
 * Whether the variants of a variant product are still expected to arrive.
 * @param state The application state.
 * @param props The selector props.
 * @param props.productId The ID of the base product.
 * @returns Whether the variants are loading.
 */
const getAreVariantsLoading = (state: unknown, { productId }: { productId: string | null }) => {
  if (
    !hasProductVariants(state, { productId })
    || getProduct(state, { productId })?.active === false
  ) {
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

const DEFAULT_RENDERERS: Record<string, ComponentType<VariantRendererProps>> = {
  dropdown: Characteristic as unknown as ComponentType<VariantRendererProps>,
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
  /** Renders dropdowns as inline lists, e.g. inside a sheet. */
  compact?: boolean;
}

/**
 * Renders the characteristics of a product and resolves the selected variant.
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
  const instanceId = useMemo(() => uniqueId('variant-selector-'), []);
  const announceTimeout = useRef<ReturnType<typeof setTimeout>>();
  const highlightFrame = useRef<number>();

  useEffect(() => () => {
    clearTimeout(announceTimeout.current);
    if (highlightFrame.current) {
      cancelAnimationFrame(highlightFrame.current);
    }
  }, []);
  const reduceMotion = useReduceMotion();
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
    preselect: settings.preselect,
  });

  usePrefetchVariants(variants, selection);

  const refs = useMemo(() => {
    const map: Record<string, RefObject<HTMLElement>> = {};
    variants?.characteristics.forEach((char) => {
      map[char.id] = createRef<HTMLElement>();
    });
    return map;
  }, [variants]);

  const checkSelection = useCallback(() => {
    if (!variants) {
      return true;
    }

    if (isComplete) {
      const match = variants.products.find(product => (
        isMatch(product.characteristics, selection)
      ));

      return !!match && match.id === variantId;
    }

    const firstUnselected = findFirstUnselected();

    if (!firstUnselected) {
      return false;
    }

    const element = refs[firstUnselected.id]?.current;

    if (element) {
      element.focus();
      element.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    }

    clearTimeout(announceTimeout.current);
    announceTimeout.current = setTimeout(() => {
      announce('product.pick_option_first', {
        params: { option: firstUnselected.label },
      });
    }, ANNOUNCE_DELAY);

    setHighlight(null);
    if (highlightFrame.current) {
      cancelAnimationFrame(highlightFrame.current);
    }
    highlightFrame.current = requestAnimationFrame(() => setHighlight(firstUnselected.id));

    return false;
  }, [findFirstUnselected, isComplete, reduceMotion, refs, selection, variantId, variants]);

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
        const Renderer = DEFAULT_RENDERERS[type] ?? DEFAULT_RENDERERS.dropdown;

        const rendererProps: VariantRendererProps = {
          charRef: refs[row.id],
          disabled: row.disabled,
          highlight: highlight === row.id,
          id: row.id,
          domId: `${instanceId}-${row.id}`,
          label: row.label,
          selected: row.selected,
          swatch: row.swatch,
          values: row.values,
          select: handleSelect,
          resetHighlight,
          chipsLayout: settings.chipsLayout,
          swatchShape: settings.swatchShape,
          swatchImageZoom: settings.swatchImageZoom,
        };

        return (
          <SurroundPortals
            key={row.id}
            portalName={PRODUCT_VARIANT_SELECT_CHARACTERISTIC}
            portalProps={{
              ...rendererProps,
              characteristic: row,
              type,
            }}
          >
            <Renderer {...rendererProps} />
          </SurroundPortals>
        );
      })}
      {isComplete && lastType !== 'dropdown' && (
        <SelectedVariantInfo productId={productId} selection={selection} />
      )}
    </VariantContext.Provider>
  );
};

export default VariantSelector;
