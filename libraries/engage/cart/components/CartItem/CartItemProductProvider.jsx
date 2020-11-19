import React, {
  useMemo, useCallback, useState, useRef,
} from 'react';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { CART_ITEM_TYPE_PRODUCT } from '@shopgate/pwa-common-commerce/cart/constants';
import { CART_INPUT_AUTO_SCROLL_DELAY } from '../../cart.constants';
import Context from './CartItemProductProvider.context';
import connect from './CartItemProductProvider.connector';
import { type OwnProps, type StateProps, type DispatchProps } from './CartItemProductProvider.types';

const { variables } = themeConfig;

type Props = OwnProps & StateProps & DispatchProps

/**
 * The CartItemProduct Provider
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemProductProvider = ({
  currency,
  deleteProduct,
  updateProduct,
  onFocus,
  cartItem,
  isEditable,
  children,
  isIos,
  currencyOverride,
}: Props) => {
  const {
    id,
    product,
    quantity,
    fulfillment = null,
    messages = [],
    status,
    subStatus,
    orderedQuantity,
    unitPromoAmount,
    unitDiscountAmount,
    price,
    promoAmount,
    discountAmount,
    extendedPrice,
    appliedPromotions,
  } = cartItem;
  const [editMode, setEditMode] = useState(false);
  const cartItemRef = useRef();

  const handleRemove = useCallback(() => {
    deleteProduct(id);
  }, [deleteProduct, id]);

  const handleUpdate = useCallback((updatedQuantity) => {
    updateProduct(id, updatedQuantity);
  }, [id, updateProduct]);

  const toggleEditMode = useCallback((isEnabled: boolean) => {
    if (!isIos && isEnabled) {
      /**
       * When the user focuses the quantity input, the keyboard will pop up an overlap the input.
       * Therefore the input has to be scrolled into the viewport again. Since between the focus and
       * the keyboard appearance some time ticks away, the execution of the scroll code is delayed.
       *
       * This should not happen on iOS devices, since their web views behave different.
       */
      setTimeout(() => {
        const yOffset = -(window.innerHeight / 2)
          + getAbsoluteHeight(cartItemRef.current)
          + variables.paymentBar.height;

        if (cartItemRef.current) {
          cartItemRef.current.scrollIntoView({
            behavior: 'smooth',
            yOffset,
          });
        }
      }, CART_INPUT_AUTO_SCROLL_DELAY);
    }

    // Give the keyboard some time to slide out after blur, before further actions are taken.
    setTimeout(() => {
      if (onFocus) {
        onFocus(isEnabled);
      }
    }, isEnabled ? 300 : 0);

    setEditMode(isEnabled);
  }, [isIos, onFocus]);

  const value = useMemo(
    () => ({
      type: CART_ITEM_TYPE_PRODUCT,
      currency: currencyOverride || currency,
      product,
      messages,
      handleRemove,
      handleUpdate,
      cartItemRef,
      toggleEditMode,
      editMode,
      isEditable,
      cartItem: {
        id,
        product,
        status,
        subStatus,
        quantity,
        orderedQuantity,
        fulfillment,
        unitPromoAmount,
        unitDiscountAmount,
        price,
        promoAmount,
        discountAmount,
        extendedPrice,
        appliedPromotions,
      },
    }),
    [
      currency,
      currencyOverride,
      editMode,
      fulfillment,
      handleRemove,
      handleUpdate,
      id,
      isEditable,
      messages,
      product,
      status,
      subStatus,
      quantity,
      orderedQuantity,
      toggleEditMode,
      unitPromoAmount,
      unitDiscountAmount,
      price,
      promoAmount,
      discountAmount,
      extendedPrice,
      appliedPromotions,
    ]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

CartItemProductProvider.defaultProps = {
  children: null,
  isEditable: true,
  onFocus: () => {},
  currencyOverride: null,
};

export default connect(CartItemProductProvider);
