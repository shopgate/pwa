import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import { useCartItemProduct, useCartItem } from './CartItem.hooks';
import { createCartItemPrices } from '../../cart.helpers';
import CartItemProductPriceListPromotion from './CartItemProductPriceListPromotion';

const styles = {
  price: css({
    fontSize: '1rem',
    fontWeight: 500,
    marginLeft: 'auto',
  }).toString(),
  priceStriked: css({
    fontSize: '.875rem',
    marginLeft: 'auto',
  }).toString(),
  priceListEntry: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }).toString(),
};

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CartItemProductPriceList = ({ classes, isSubtotal, showLabels }) => {
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
          <li key={`total_${index}`} className={classNames(styles.priceListEntry, classes?.entry)}>
            { (showLabels || !isSubtotal) && (
              <CartItemProductPriceListPromotion
                isCoupon={isCoupon}
                isPromo={isPromo}
                className={classes?.promo}
              />
            )}
            { !isLast ? (
              <PriceStriked
                className={classNames(styles.priceStriked, classes?.priceStriked)}
                value={price}
                currency={currency}
              />
            ) : (
              <Price
                className={classNames(styles.price, classes?.price)}
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
