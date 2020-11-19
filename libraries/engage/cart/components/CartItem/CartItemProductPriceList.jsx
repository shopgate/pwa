import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import { useCartItemProduct, useCartItem } from './CartItem.hooks';
import { createCartItemPrices } from '../../cart.helpers';
import { priceStriked, price as priceStyle, priceListEntry } from './CartItemProductPrice.style';
import CartItemProductPriceListPromotion from './CartItemProductPriceListPromotion';

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

    if (isOrderDetails || isCheckoutConfirmation) {
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
          <li key={`total_${index}`} className={priceListEntry}>
            { !isLast ? (
              <PriceStriked
                className={classNames(priceStriked, classes?.priceStriked)}
                value={price}
                currency={currency}
              />
            ) : (
              <Price
                className={classNames(priceStyle, classes?.price)}
                unitPrice={price}
                currency={currency}
                discounted={prices.length > 1}
                taxDisclaimer
              />
            )}
            { (showLabels || !isSubtotal) && (
              <CartItemProductPriceListPromotion isCoupon={isCoupon} isPromo={isPromo} />
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
