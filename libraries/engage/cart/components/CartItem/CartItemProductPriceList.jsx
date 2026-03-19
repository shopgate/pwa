import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import { useCartItemProduct, useCartItem } from './CartItem.hooks';
import { createCartItemPrices } from '../../cart.helpers';
import CartItemProductPriceListPromotion from './CartItemProductPriceListPromotion';

const useStyles = makeStyles()({
  price: {
    fontSize: '1rem',
    fontWeight: 500,
    marginLeft: 'auto',
  },
  priceStriked: {
    fontSize: '.875rem',
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
  const { classes } = useStyles();
  const { isOrderDetails, isCheckoutConfirmation } = useCartItem();
  const context = useCartItemProduct();
  const { currency, cartItem } = context;

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
          <li key={`total_${index}`} className={classNames(classes.priceListEntry, customClasses?.entry)}>
            { (showLabels || !isSubtotal) && (
              <CartItemProductPriceListPromotion
                isCoupon={isCoupon}
                isPromo={isPromo}
                className={customClasses?.promo}
              />
            )}
            { !isLast ? (
              <PriceStriked
                className={classNames(classes.priceStriked, customClasses?.priceStriked)}
                value={price}
                currency={currency}
              />
            ) : (
              <Price
                className={classNames(classes.price, customClasses?.price)}
                unitPrice={price}
                currency={currency}
                discounted={prices.length > 1 || price === 0}
                taxDisclaimer
                allowFree
              />
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
