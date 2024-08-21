import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import styles from './style';

/**
 * @param {Object} price The product price.
 * @returns {JSX}
 */
function LiveShoppingPrice({ price }) {
  const priceStriked = price.unitPriceStriked || price.msrp;

  return (
    <Grid className={styles.grid}>
      {priceStriked > 0 &&
        <PriceStriked
          className={styles.priceStriked}
          value={priceStriked}
          currency={price.currency}
        />
      }
      <Price
        discounted={priceStriked > 0}
        className={priceStriked > 0 ? styles.price : ''}
        unitPrice={price.unitPrice}
        unitPriceMin={price.unitPriceMin}
        currency={price.currency}
      />
    </Grid>
  );
}

LiveShoppingPrice.propTypes = {
  price: PropTypes.shape().isRequired,
};

export default LiveShoppingPrice;
