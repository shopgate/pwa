import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isMatch from 'lodash/isMatch';
import { SheetDrawer as SheetDrawerComponent } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { makeStyles } from '@shopgate/engage/styles';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import fetchProduct from '@shopgate/pwa-common-commerce/product/actions/fetchProduct';
import fetchProductVariants from '@shopgate/pwa-common-commerce/product/actions/fetchProductVariants';
import * as productSelectors from '@shopgate/pwa-common-commerce/product/selectors/product';
import ConditionerClass from '@shopgate/pwa-core/classes/Conditioner';
import { ProductContext } from '../context';
import ProductImage from '../ProductImage';
import { VariantSelector } from '../VariantSelector';
import type { ProductVariants, VariantProduct, VariantSelection } from '../VariantSelector';

/** Product data used by the sheet. */
export interface VariantSheetProduct extends VariantProduct {
  name?: string;
  price?: {
    currency: string;
    unitPrice: number;
    unitPriceStriked?: number | null;
    msrp?: number | null;
  } | null;
  fulfillmentMethods?: string[] | null;
}

export interface VariantSelectSheetProps {
  /** ID of the base product. */
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  /** Called with the selected variant when the add to cart button is pressed. */
  onAddToCart: (variant: VariantSheetProduct) => unknown;
}

const SheetDrawer = SheetDrawerComponent as unknown as React.ComponentType<{
  isOpen: boolean;
  onClose: () => void;
  onDidClose?: () => void;
  title?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}>;

type ProductSelector<T> = (state: unknown, props: { productId: string | null }) => T;

const getProduct =
  productSelectors.getProduct as unknown as ProductSelector<VariantSheetProduct | null>;
const getProductVariants =
  productSelectors.getProductVariants as unknown as ProductSelector<ProductVariants | null>;

const useStyles = makeStyles({ name: 'VariantSelectSheet' })(theme => ({
  content: {
    paddingTop: 16,
  },
  header: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    padding: '0 16px 16px',
  },
  image: {
    width: 64,
    flexShrink: 0,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  name: {
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: 4,
  },
  prices: {
    display: 'flex',
    gap: 8,
    alignItems: 'baseline',
  },
  footer: {
    padding: '8px 16px calc(16px + var(--safe-area-inset-bottom, 0px))',
  },
}));

/**
 * Finds the variant that matches a complete selection.
 * @param variants The variants.
 * @param selection The selection.
 * @returns The variant or null.
 */
const findVariant = (
  variants: ProductVariants | null,
  selection: VariantSelection
): VariantSheetProduct | null => {
  if (!variants || Object.keys(selection).length !== variants.characteristics.length) {
    return null;
  }

  return (variants.products.find(product => (
    isMatch(product.characteristics, selection)
  )) as VariantSheetProduct | undefined) ?? null;
};

/**
 * Sheet to select a variant and add it to the cart outside of the product page.
 * @param props The component props.
 * @returns The sheet.
 */
const VariantSelectSheet = ({
  productId,
  isOpen,
  onClose,
  onAddToCart,
}: VariantSelectSheetProps) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const [selection, setSelection] = useState<VariantSelection>({});

  const baseProduct = useSelector((state: unknown) => getProduct(state, { productId }));
  const variants = useSelector((state: unknown) => getProductVariants(state, { productId }));
  const variantFromList = useMemo(() => findVariant(variants, selection), [variants, selection]);
  const variantId = variantFromList?.id ?? null;
  const variantFromStore = useSelector(
    (state: unknown) => (variantId ? getProduct(state, { productId: variantId }) : null)
  );
  const variant = variantFromStore || variantFromList;
  const shown = variant || baseProduct;

  useEffect(() => {
    setSelection({});
  }, [productId]);

  const triggerRef = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  if (isOpen && !wasOpen.current) {
    triggerRef.current = document.activeElement as HTMLElement | null;
  }
  wasOpen.current = isOpen;

  const restoreFocus = useCallback(() => {
    const trigger = triggerRef.current;

    if (trigger?.isConnected) {
      trigger.focus();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dispatch(fetchProduct(productId) as never);
    dispatch(fetchProductVariants(productId) as never);
  }, [dispatch, isOpen, productId]);

  const isOrderable = !!variant && variant.stock?.orderable !== false;
  const conditioner = useMemo(() => new ConditionerClass(new Map()), []);
  const submitted = useRef(false);

  useEffect(() => {
    if (isOpen) {
      submitted.current = false;
    }
  }, [isOpen]);

  const handleAddToCart = useCallback(async () => {
    if (submitted.current) {
      return;
    }

    submitted.current = true;

    if (!(await conditioner.check()) || !variant || !isOrderable) {
      submitted.current = false;
      return;
    }

    onAddToCart(variant);
  }, [conditioner, isOrderable, onAddToCart, variant]);

  const contextValue = useMemo(() => ({
    productId,
    variantId,
    characteristics: selection,
    conditioner,
    fulfillmentMethods: null,
    options: {},
    isFetching: false,
  }), [conditioner, productId, selection, variantId]);

  const price = variantFromStore?.price || variantFromList?.price || baseProduct?.price;
  const strikePrice = price && Math.max(price.unitPriceStriked || 0, price.msrp || 0);

  return (
    <SheetDrawer
      isOpen={isOpen}
      onClose={onClose}
      onDidClose={restoreFocus}
      title={i18n.text('product.add_to_cart')}
      contentClassName={cx(classes.content, 'engage__variant-select-sheet')}
    >
      <div className={cx(classes.header, 'engage__variant-select-sheet__header')}>
        <div className={classes.image}>
          <ProductImage
            src={shown?.featuredImageBaseUrl || shown?.featuredImageUrl || null}
            context="list"
            alt={baseProduct?.name || ''}
          />
        </div>
        <div>
          <div className={cx(classes.name, 'engage__variant-select-sheet__name')}>
            {baseProduct?.name}
          </div>
          {price && (
            <div className={cx(classes.prices, 'engage__variant-select-sheet__price')}>
              <Price
                currency={price.currency}
                unitPrice={price.unitPrice}
                discounted={!!strikePrice && strikePrice > price.unitPrice}
              />
              {!!strikePrice && strikePrice > price.unitPrice && (
                <PriceStriked currency={price.currency} value={strikePrice} />
              )}
            </div>
          )}
        </div>
      </div>
      <ProductContext.Provider value={contextValue}>
        <VariantSelector
          key={productId}
          productId={productId}
          variantId={variantId}
          onCharacteristicsChange={setSelection}
          conditioner={conditioner}
          compact
        />
      </ProductContext.Provider>
      <div className={cx(classes.footer, 'engage__variant-select-sheet__footer')}>
        <Button
          color="cta"
          fullWidth
          disabled={!variants || (!!variant && !isOrderable)}
          onClick={handleAddToCart}
        >
          {i18n.text('product.add_to_cart')}
        </Button>
      </div>
    </SheetDrawer>
  );
};

export default VariantSelectSheet;
