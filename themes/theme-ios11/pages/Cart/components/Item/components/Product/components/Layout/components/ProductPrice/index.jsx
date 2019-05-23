import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import * as portals from '@shopgate/engage/cart';
import { Price } from '@shopgate/engage/components';
import { PriceStriked } from '@shopgate/engage/components';
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
          <Portal name={portals.CART_ITEM_PRICE_STRIKED_BEFORE} props={context} />
          <Portal name={portals.CART_ITEM_PRICE_STRIKED} props={context}>
            <PriceStriked
              className={styles.priceStriked}
              value={defaultPrice}
              currency={currency}
            />
          </Portal>
          <Portal name={portals.CART_ITEM_PRICE_STRIKED_AFTER} props={context} />
        </Fragment>
      )}
      <Portal name={portals.CART_ITEM_PRICE_BEFORE} props={context} />
      <Portal name={portals.CART_ITEM_PRICE} props={context}>
        <Price
          className={styles.price}
          currency={currency}
          discounted={hasStrikePrice}
          taxDisclaimer
          unitPrice={price}
        />
      </Portal>
      <Portal name={portals.CART_ITEM_PRICE_AFTER} props={context} />
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
