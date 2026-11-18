import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography, SurroundPortals } from '@shopgate/engage/components';
import { CART_ITEM_PRICE, CART_ITEM_PRICE_STRIKED } from '@shopgate/engage/cart';
import { makeStyles } from '@shopgate/engage/styles';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import { useCartItemProduct, useCartItem } from './CartItem.hooks';
import { createCartItemPrices } from '../../cart.helpers';
import CartItemProductPriceListPromotion from './CartItemProductPriceListPromotion';

const useStyles = makeStyles()({
  price: {
    marginLeft: 'auto',
  },
  priceStriked: {
    marginLeft: 'auto',
  },
  priceListEntry: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

/**
 * @param {Object} props The component props
 * @param {Object} [props.classes] CSS class names
 * @param {boolean} [props.isSubtotal] Whether to show subtotal prices
 * @param {boolean} [props.showLabels] Whether to show promotion labels
 * @returns {JSX.Element}
 */
const CartItemProductPriceList = ({ classes: customClasses, isSubtotal, showLabels }) => {
  const { classes, cx } = useStyles();
  const { isOrderDetails, isCheckoutConfirmation } = useCartItem();
  const context = useCartItemProduct();
  const { currency, cartItem } = context;

  const portalProps = useMemo(() => ({
    context: {
      type: context.type,
      cartItemId: context.cartItemId,
      product: context.product,
    },
    ...context,
    isOrderDetails,
    isCheckoutConfirmation,
    isSubtotal,
    quantity: context.cartItem.quantity,
    handleDelete: context.handleRemove,
  }), [context, isCheckoutConfirmation, isOrderDetails, isSubtotal]);

  const prices = useMemo(() => {
    const result = createCartItemPrices(cartItem)[isSubtotal ? 'subtotal' : 'price'];
    // Not striked prices when the product is free or the cart is used to display an order
    if (result[result.length - 1]?.price === 0 || isOrderDetails || isCheckoutConfirmation) {
      return result.slice(-1);
    }

    return result;
  }, [cartItem, isCheckoutConfirmation, isOrderDetails, isSubtotal]);

  return (
    <ul>
      { prices.map(({ price, isCoupon, isPromo }, index) => {
        const isLast = index === prices.length - 1;
        return (
          /* eslint-disable react/no-array-index-key */
          <li key={`total_${index}`} className={cx(classes.priceListEntry, customClasses?.entry)}>
            { (showLabels || !isSubtotal) && (
              <CartItemProductPriceListPromotion
                isCoupon={isCoupon}
                isPromo={isPromo}
                className={customClasses?.promo}
              />
            )}
            { !isLast ? (
              <Typography
                variant="body2"
                component="span"
                className={cx(classes.priceStriked, customClasses?.priceStriked)}
              >
                <SurroundPortals
                  portalName={CART_ITEM_PRICE_STRIKED}
                  portalProps={{
                    ...portalProps,
                    price,
                  }}
                >
                  <PriceStriked
                    value={price}
                    currency={currency}
                  />
                </SurroundPortals>
              </Typography>
            ) : (
              <Typography fontWeight="medium" component="span" className={cx(classes.price, customClasses?.price)}>
                <SurroundPortals
                  portalName={CART_ITEM_PRICE}
                  portalProps={{
                    ...portalProps,
                    price,
                  }}
                >
                  <Price
                    unitPrice={price}
                    currency={currency}
                    discounted={prices.length > 1 || price === 0}
                    taxDisclaimer
                    allowFree
                  />
                </SurroundPortals>
              </Typography>
            )}

          </li>
          /* eslint-enable react/no-array-index-key */
        );
      })}
    </ul>
  );
};

CartItemProductPriceList.propTypes = {
  classes: PropTypes.shape({
    price: PropTypes.string,
    priceStriked: PropTypes.string,
    promo: PropTypes.string,
    entry: PropTypes.string,
  }),
  isSubtotal: PropTypes.bool,
  showLabels: PropTypes.bool,
};

CartItemProductPriceList.defaultProps = {
  isSubtotal: false,
  showLabels: false,
  classes: {
    price: null,
    priceStriked: null,
  },
};

export default CartItemProductPriceList;
