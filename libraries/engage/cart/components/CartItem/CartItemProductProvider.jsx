import React, {
  useMemo, useCallback, useState, useRef,
} from 'react';
import { CART_ITEM_TYPE_PRODUCT } from '@shopgate/pwa-common-commerce/cart/constants';
import PropTypes from 'prop-types';
import Context from './CartItemProductProvider.context';
import connect from './CartItemProductProvider.connector';
import CartItemProductProviderLegacy from './CartItemProductProviderLegacy';

/**
 * @typedef {import('./CartItemProductProvider.types').OwnProps} OwnProps
 * @typedef {import('./CartItemProductProvider.types').StateProps} StateProps
 * @typedef {import('./CartItemProductProvider.types').DispatchProps} DispatchProps
 */

/**
 * @typedef {OwnProps & StateProps & DispatchProps} Props
 */

/**
 * The CartItemProduct Provider
 * @param {Props} props The component props.
 * @returns {JSX.Element}
 */
const CartItemProductProvider = ({
  currency,
  deleteProduct,
  updateProduct,
  onFocus,
  cartItem,
  isEditable,
  children,
  currencyOverride,
}) => {
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
    flags = {},
  } = cartItem;
  const [editMode, setEditMode] = useState(false);
  const cartItemRef = useRef();

  const handleRemove = useCallback(() => {
    deleteProduct(id);
  }, [deleteProduct, id]);

  const handleUpdate = useCallback((updatedQuantity) => {
    updateProduct(id, updatedQuantity);
  }, [id, updateProduct]);

  const toggleEditMode = useCallback((isEnabled) => {
    // Give the keyboard some time to slide out after blur, before further actions are taken.
    setTimeout(() => {
      if (onFocus) {
        onFocus(isEnabled);
      }
    }, isEnabled ? 300 : 0);

    setEditMode(isEnabled);
  }, [onFocus]);

  const value = useMemo(
    () => {
      const isLinkable = flags?.disableLink !== true;
      const allowQuantityChange = flags?.disableQuantityField !== true;

      return {
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
        isLinkable,
        allowQuantityChange,
        cartItemId: id,
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
      };
    },
    [
      currency,
      currencyOverride,
      editMode,
      fulfillment,
      handleRemove,
      handleUpdate,
      id,
      isEditable,
      flags,
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
      <CartItemProductProviderLegacy>
        {children}
      </CartItemProductProviderLegacy>
    </Context.Provider>
  );
};

CartItemProductProvider.propTypes = {
  cartItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    product: PropTypes.shape().isRequired,
    quantity: PropTypes.number.isRequired,
    fulfillment: PropTypes.shape(),
    messages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    status: PropTypes.string,
    subStatus: PropTypes.string,
    orderedQuantity: PropTypes.number,
    unitPromoAmount: PropTypes.number,
    unitDiscountAmount: PropTypes.number,
    price: PropTypes.number,
    promoAmount: PropTypes.number,
    discountAmount: PropTypes.number,
    extendedPrice: PropTypes.number,
    appliedPromotions: PropTypes.arrayOf(PropTypes.shape()),
    flags: PropTypes.shape({
      disableLink: PropTypes.bool,
      disableQuantityField: PropTypes.bool,
    }),
  }).isRequired,
  deleteProduct: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  children: PropTypes.node,
  currency: PropTypes.string,
  currencyOverride: PropTypes.string,
  isEditable: PropTypes.bool,
  onFocus: PropTypes.func,
};

CartItemProductProvider.defaultProps = {
  children: null,
  isEditable: true,
  onFocus: () => {},
  currencyOverride: null,
  currency: null,
};

export default connect(CartItemProductProvider);
