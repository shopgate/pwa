import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { IconButton } from '@shopgate/engage/components/v2';
import CartPlusIcon from '@shopgate/pwa-ui-shared/icons/CartPlusIcon';
import TickIcon from '@shopgate/pwa-ui-shared/icons/TickIcon';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
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
}

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

const ADDED_FEEDBACK_DURATION = 1500;

const useStyles = makeStyles({ name: 'ProductCardAddToCart' })({
  root: {
    display: 'inline-flex',
  },
});

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
const ProductCardAddToCart = ({ productId, className }: ProductCardAddToCartProps) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const store = useStore();
  const product = useSelector((state: unknown) => getProduct(state, { productId }));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const addedTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(addedTimeout.current), []);

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
    setAdded(true);
    addedTimeout.current = setTimeout(() => setAdded(false), ADDED_FEEDBACK_DURATION);

    return dispatch(addProductsToCart([{
      productId: id,
      quantity: 1,
      ...(method && method !== DIRECT_SHIP && location && {
        fulfillment: {
          method,
          location: { code: location.code, name: location.name || '' },
        },
      }),
    }]) as never);
  }, [dispatch, store]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!product) {
      return false;
    }

    if (hasOptions) {
      dispatch(historyPush({ pathname: getProductRoute(product.id) }) as never);
      return false;
    }

    if (hasVariants) {
      setSheetOpen(true);
      return false;
    }

    return addToCart(product.id);
  }, [addToCart, dispatch, hasOptions, hasVariants, product]);

  const handleSheetAddToCart = useCallback((variant: VariantSheetProduct) => {
    setSheetOpen(false);
    return addToCart(variant.id);
  }, [addToCart]);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  if (!product) {
    return null;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx(classes.root, 'engage__product-card-add-to-cart', className)}
      onClick={stop}
      onKeyDown={stop}
    >
      <IconButton
        aria-label={i18n.text('product.add_to_cart')}
        variant="surface"
        color="secondary"
        size="small"
        disabled={isDisabled}
        onClick={handleClick}
        data-added={added ? 'true' : undefined}
      >
        {added ? <TickIcon /> : <CartPlusIcon />}
      </IconButton>
      {hasVariants && (
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
