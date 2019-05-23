import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal, Price, PriceStriked } from '@shopgate/engage/components';
import {
  CART_ITEM_PRICE_STRIKED_BEFORE,
  CART_ITEM_PRICE_STRIKED,
  CART_ITEM_PRICE_STRIKED_AFTER,
  CART_ITEM_PRICE_BEFORE,
  CART_ITEM_PRICE,
  CART_ITEM_PRICE_AFTER,
} from '@shopgate/engage/cart';
import styles from './style';

/**
 * The Cart Product Price component.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const ProductPrice = ({ currency, defaultPrice, specialPrice }, context) => {
  const hasStrikePrice = typeof specialPrice === 'number';
  const price = hasStrikePrice ? specialPrice : defaultPrice;

  return (
    <Fragment>
      {hasStrikePrice && (
        <Fragment>
          <Portal name={CART_ITEM_PRICE_STRIKED_BEFORE} props={context} />
          <Portal name={CART_ITEM_PRICE_STRIKED} props={context}>
            <PriceStriked
              className={styles.priceStriked}
              value={defaultPrice}
              currency={currency}
            />
          </Portal>
          <Portal name={CART_ITEM_PRICE_STRIKED_AFTER} props={context} />
        </Fragment>
      )}
      <Portal name={CART_ITEM_PRICE_BEFORE} props={context} />
      <Portal name={CART_ITEM_PRICE} props={context}>
        <Price
          className={styles.price}
          currency={currency}
          discounted={hasStrikePrice}
          taxDisclaimer
          unitPrice={price}
        />
      </Portal>
      <Portal name={CART_ITEM_PRICE_AFTER} props={context} />
    </Fragment>
  );
};

ProductPrice.propTypes = {
  currency: PropTypes.string.isRequired,
  defaultPrice: PropTypes.number.isRequired,
  specialPrice: PropTypes.number,
};

ProductPrice.defaultProps = {
  specialPrice: null,
};

ProductPrice.contextTypes = {
  cartItemId: PropTypes.string,
  type: PropTypes.string,
};

export default ProductPrice;
