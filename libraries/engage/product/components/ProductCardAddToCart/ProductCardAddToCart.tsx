import {
  useCallback, useEffect, useMemo, useRef, useState, type MouseEvent,
} from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { CartIcon, SurroundPortals } from '@shopgate/engage/components';
import { Button, CircularProgress, IconButton } from '@shopgate/engage/components/v2';
import { hasNewServices, i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { useNavigation } from '@shopgate/engage/core/hooks';
import { addProductsToCart } from '@shopgate/engage/cart';
import { getProductRoute } from '@shopgate/engage/product/helpers';
import { PRODUCT_ITEM_ADD_TO_CART } from '@shopgate/engage/category/constants';
import * as locationSelectors from '@shopgate/engage/locations/selectors';
import { DIRECT_SHIP } from '@shopgate/engage/locations/constants';
import { broadcastLiveMessage as broadcast } from '@shopgate/engage/a11y/helpers';
import { getProduct } from '../../selectors/catalog';
import { useAddToCartFeedback } from '../../hooks/useAddToCartFeedback';
import { AddedTick } from '../AddedTick';
import { VariantSelectSheet } from '../VariantSelectSheet';
import type { VariantSheetProduct } from '../VariantSelectSheet';

export interface ProductCardAddToCartProps {
  productId: string;
  className?: string;
  /** `icon` renders an action button, `button` a full width button with label. */
  variant?: 'icon' | 'button';
}

const getPreferredFulfillmentMethod = (
  locationSelectors.getPreferredFulfillmentMethod
) as unknown as (
  state: unknown,
  props: { productId: string }
) => string | null;
const getPreferredLocation = locationSelectors.getPreferredLocation as unknown as (
  state: unknown,
  props: { productId: string }
) => { code: string; name?: string } | null;
const broadcastLiveMessage = broadcast as unknown as (
  message: string,
  options: { params: Record<string, number> }
) => void;

const COMPACT_BUTTON_WIDTH = 160;

const useStyles = makeStyles({ name: 'ProductCardAddToCart' })(theme => ({
  root: {
    display: 'inline-flex',
    '&[data-variant="button"]': {
      display: 'flex',
      width: '100%',
    },
  },
  labelButton: {
    position: 'relative',
    minHeight: theme.spacing(4),
    lineHeight: 1.2,
    textAlign: 'center',
    overflowWrap: 'anywhere',
    '&[data-compact]': {
      '--font-size': `calc(${theme.typography.button.fontSize} * 0.8)`,
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
  },
  content: {
    display: 'inline-flex',
    alignItems: 'center',
    '&[data-hidden]': {
      opacity: 0,
    },
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25em',
  },
}));

/**
 * Add to cart button for product tiles and cards. Variant products open a sheet to pick the
 * variant, products with options lead to the product page.
 * @returns The button.
 */
const ProductCardAddToCart = ({
  productId,
  className,
  variant = 'icon',
}: ProductCardAddToCartProps) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch() as unknown as (action: unknown) => unknown;
  const { push } = useNavigation();
  const store = useStore();
  const product = useSelector((state: unknown) => getProduct(state, { productId }));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMounted, setSheetMounted] = useState(false);
  const { state: addState, track } = useAddToCartFeedback();
  const [compact, setCompact] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = rootRef.current;

    if (variant === 'icon' || !element || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      setCompact(entry.contentRect.width < COMPACT_BUTTON_WIDTH);
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, [variant]);

  const hasVariants = !!product?.flags?.hasVariants;
  const hasOptions = !!product?.flags?.hasOptions;
  const isDisabled = !product
    || (!hasVariants && !hasOptions && product.stock?.orderable === false);

  const addToCart = useCallback((id: string) => {
    const state = store.getState();
    const method = hasNewServices()
      ? getPreferredFulfillmentMethod(state, { productId: id })
      : null;
    const location = method ? getPreferredLocation(state, { productId: id }) : null;

    if (method && method !== DIRECT_SHIP && !location) {
      push({ pathname: getProductRoute(id) });
      return false;
    }

    broadcastLiveMessage('product.adding_item', { params: { count: 1 } });

    const request = dispatch(addProductsToCart([{
      productId: id,
      quantity: 1,
      ...(method && method !== DIRECT_SHIP && location && {
        fulfillment: {
          method,
          location: {
            code: location.code,
            name: location.name || '',
          },
        },
      }),
    }])) as Promise<{ messages?: { type?: string }[] } | undefined>;

    track(request, () => {
      broadcastLiveMessage('product.item_added', { params: { count: 1 } });
    });

    return request;
  }, [dispatch, push, store, track]);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!product || addState !== 'idle') {
      return false;
    }

    if (hasOptions) {
      push({ pathname: getProductRoute(product.id) });
      return false;
    }

    if (hasVariants) {
      setSheetMounted(true);
      setSheetOpen(true);
      return false;
    }

    return addToCart(product.id);
  }, [addState, addToCart, hasOptions, hasVariants, product, push]);

  const handleSheetAddToCart = useCallback((selected: VariantSheetProduct) => {
    if (addState !== 'idle') {
      return false;
    }

    setSheetOpen(false);
    return addToCart(selected.id);
  }, [addState, addToCart]);

  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const portalProps = useMemo(() => ({
    productId,
    variant,
  }), [productId, variant]);

  if (!product) {
    return null;
  }

  const added = addState === 'added';
  const pending = addState === 'pending';
  const label = i18n.text('product.add_to_cart');
  const ariaLabel = product.name ? `${label}: ${product.name}` : label;

  return (
    <div
      ref={rootRef}
      className={cx(classes.root, 'engage__product-card-add-to-cart', className)}
      data-variant={variant}
      data-state={addState}
    >
      <SurroundPortals portalName={PRODUCT_ITEM_ADD_TO_CART} portalProps={portalProps}>
        {variant === 'button' ? (
          <Button
            variant={added ? 'contained' : 'outlined'}
            color="cta"
            size="small"
            fullWidth
            aria-label={ariaLabel}
            disabled={isDisabled}
            aria-disabled={pending || undefined}
            aria-busy={pending || undefined}
            onClick={handleClick}
            startIcon={compact || added || pending ? undefined : <CartIcon />}
            className={cx(classes.labelButton, 'engage__product-card-add-to-cart__button')}
            data-compact={compact ? 'true' : undefined}
          >
            <span
              className={cx(classes.content, 'engage__product-card-add-to-cart__label')}
              data-hidden={added || pending ? 'true' : undefined}
            >
              {label}
            </span>
            {pending && (
              <span
                className={cx(classes.overlay, 'engage__product-card-add-to-cart__progress')}
                aria-hidden
              >
                <CircularProgress color="inherit" size={16} />
              </span>
            )}
            {added && (
              <AddedTick
                className={cx(classes.tick, 'engage__product-card-add-to-cart__tick')}
              />
            )}
          </Button>
        ) : (
          <IconButton
            aria-label={ariaLabel}
            variant="surface"
            color="secondary"
            size="small"
            disabled={isDisabled}
            aria-disabled={pending || undefined}
            aria-busy={pending || undefined}
            onClick={handleClick}
          >
            {pending && <CircularProgress color="inherit" size={16} />}
            {added && (
              <AddedTick className="engage__product-card-add-to-cart__tick" />
            )}
            {!pending && !added && <CartIcon />}
          </IconButton>
        )}
      </SurroundPortals>
      {hasVariants && sheetMounted && (
        <VariantSelectSheet
          productId={product.id}
          isOpen={sheetOpen}
          onClose={closeSheet}
          onAddToCart={handleSheetAddToCart}
        />
      )}
    </div>
  );
};

export default ProductCardAddToCart;
