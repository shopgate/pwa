import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Button, CircularProgress, IconButton } from '@shopgate/engage/components/v2';
import CartIcon from '@shopgate/pwa-ui-shared/icons/CartIcon';
import TickIcon from '@shopgate/pwa-ui-shared/icons/TickIcon';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { keyframes, makeStyles } from '@shopgate/engage/styles';
import { historyPush } from '@shopgate/pwa-common/actions/router/historyPush';
import addProductsToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import * as productSelectors from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product/helpers';
import * as locationSelectors from '@shopgate/engage/locations/selectors';
import { DIRECT_SHIP } from '@shopgate/engage/locations/constants';
import { broadcastLiveMessage as broadcast } from '@shopgate/engage/a11y';
import { VariantSelectSheet } from '../VariantSelectSheet';
import type { VariantSheetProduct } from '../VariantSelectSheet';

interface CardProduct {
  id: string;
  flags?: { hasVariants?: boolean; hasOptions?: boolean } | null;
  stock?: { orderable?: boolean } | null;
}

export interface ProductCardAddToCartProps {
  productId: string;
  className?: string;
  /** `icon` renders an action button, `button` a full width button with label. */
  variant?: 'icon' | 'button';
}

type AddState = 'idle' | 'pending' | 'added';

const getProduct = productSelectors.getProduct as unknown as (
  state: unknown,
  props: { productId: string }
) => CardProduct | null;

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

const tickIn = keyframes({
  '0%': { transform: 'scale(0.3)', opacity: 0 },
  '60%': { transform: 'scale(1.15)', opacity: 1 },
  '100%': { transform: 'scale(1)', opacity: 1 },
});

const ADDED_FEEDBACK_DURATION = 1500;

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
    whiteSpace: 'nowrap',
    '&[data-compact]': {
      '--font-size': `calc(${theme.typography.button.fontSize} * 0.8)`,
      paddingLeft: 4,
      paddingRight: 4,
      whiteSpace: 'normal',
      lineHeight: 1.2,
      textAlign: 'center',
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
    animation: `${tickIn} 400ms ${theme.transitions.easing.easeOut}`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
  iconTick: {
    display: 'flex',
    animation: `${tickIn} 400ms ${theme.transitions.easing.easeOut}`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
}));

/**
 * Stops events from reaching a surrounding product link.
 * @param event The event.
 */
const stop = (event: React.SyntheticEvent) => {
  event.stopPropagation();
};

/**
 * Add to cart button for product tiles and cards. Variant products open a sheet to pick the
 * variant, products with options lead to the product page.
 * @param props The component props.
 * @returns The button.
 */
const ProductCardAddToCart = ({
  productId,
  className,
  variant = 'icon',
}: ProductCardAddToCartProps) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const store = useStore();
  const product = useSelector((state: unknown) => getProduct(state, { productId }));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMounted, setSheetMounted] = useState(false);
  const [addState, setAddState] = useState<AddState>('idle');
  const [compact, setCompact] = useState(false);
  const addedTimeout = useRef<ReturnType<typeof setTimeout>>();
  const rootRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);

  useEffect(() => () => {
    mounted.current = false;
    clearTimeout(addedTimeout.current);
  }, []);

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
      dispatch(historyPush({ pathname: getProductRoute(id) }) as never);
      return false;
    }

    broadcastLiveMessage('product.adding_item', { params: { count: 1 } });

    clearTimeout(addedTimeout.current);
    setAddState('pending');

    const request = dispatch(addProductsToCart([{
      productId: id,
      quantity: 1,
      ...(method && method !== DIRECT_SHIP && location && {
        fulfillment: {
          method,
          location: { code: location.code, name: location.name || '' },
        },
      }),
    }]) as never) as Promise<{ messages?: { type?: string }[] } | undefined>;

    Promise.resolve(request)
      .then((result) => {
        const failed = result?.messages?.some(message => message.type === 'error');

        if (!mounted.current) {
          return;
        }

        if (failed) {
          setAddState('idle');
          return;
        }

        broadcastLiveMessage('product.item_added', { params: { count: 1 } });
        setAddState('added');
        addedTimeout.current = setTimeout(() => setAddState('idle'), ADDED_FEEDBACK_DURATION);
      })
      .catch(() => {
        if (mounted.current) {
          setAddState('idle');
        }
      });

    return request;
  }, [dispatch, store]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!product || addState !== 'idle') {
      return false;
    }

    if (hasOptions) {
      dispatch(historyPush({ pathname: getProductRoute(product.id) }) as never);
      return false;
    }

    if (hasVariants) {
      setSheetMounted(true);
      setSheetOpen(true);
      return false;
    }

    return addToCart(product.id);
  }, [addState, addToCart, dispatch, hasOptions, hasVariants, product]);

  const handleSheetAddToCart = useCallback((selected: VariantSheetProduct) => {
    if (addState !== 'idle') {
      return false;
    }

    setSheetOpen(false);
    return addToCart(selected.id);
  }, [addState, addToCart]);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  if (!product) {
    return null;
  }

  const added = addState === 'added';
  const pending = addState === 'pending';

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={rootRef}
      className={cx(classes.root, 'engage__product-card-add-to-cart', className)}
      data-variant={variant}
      data-state={addState}
      onClick={stop}
      onKeyDown={stop}
    >
      {variant === 'button' ? (
        <Button
          variant={added ? 'contained' : 'outlined'}
          color="cta"
          size="small"
          fullWidth
          disabled={isDisabled}
          aria-disabled={pending || undefined}
          aria-busy={pending || undefined}
          onClick={handleClick}
          startIcon={compact || added || pending ? undefined : <CartIcon />}
          className={classes.labelButton}
          data-compact={compact ? 'true' : undefined}
        >
          <span className={classes.content} data-hidden={added || pending ? 'true' : undefined}>
            {i18n.text('product.add_to_cart')}
          </span>
          {pending && (
            <span className={classes.overlay} aria-hidden>
              <CircularProgress color="inherit" size={16} />
            </span>
          )}
          {added && (
            <span className={classes.tick} aria-hidden>
              <TickIcon />
            </span>
          )}
        </Button>
      ) : (
        <IconButton
          aria-label={i18n.text('product.add_to_cart')}
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
            <span className={classes.iconTick}>
              <TickIcon />
            </span>
          )}
          {!pending && !added && <CartIcon />}
        </IconButton>
      )}
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
