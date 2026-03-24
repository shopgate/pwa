import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  grid: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: variables.gap.small,
  },
  priceStriked: {
    fontSize: '0.875rem',
  },
  price: {
    color: 'var(--color-primary)',
    fontSize: '1.25rem',
    lineHeight: 1,
  },
});

/**
 * @param {Object} price The product price.
 * @returns {JSX}
 */
function LiveShoppingPrice({ price }) {
  const { classes } = useStyles();
  const priceStriked = price.unitPriceStriked || price.msrp;

  return (
    <Grid className={classes.grid}>
      {priceStriked > 0 &&
        <PriceStriked
          className={classes.priceStriked}
          value={priceStriked}
          currency={price.currency}
        />}
      <Price
        discounted={priceStriked > 0}
        className={priceStriked > 0 ? classes.price : ''}
        unitPrice={price.unitPrice}
        unitPriceMin={price.unitPriceMin}
        unitPriceMax={price.unitPriceMax}
        currency={price.currency}
      />
    </Grid>
  );
}

LiveShoppingPrice.propTypes = {
  price: PropTypes.shape().isRequired,
};

export default LiveShoppingPrice;
