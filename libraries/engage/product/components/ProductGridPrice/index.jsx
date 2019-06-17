import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid, Price, PriceStriked, PriceInfo } from '@shopgate/engage/components';
import withPriceCalculation from '../../hocs/withPriceCalculation';
import styles from './style';

/**
 * The ProductGridPrice component is supposed to be used to display prices at product grids. It
 * renders a row with the current price and a strike price when present. As same as the price info.
 * @param {Object} price The price object of a product entity.
 * @return {JSX}
 */
const ProductGridPrice = ({ price }) => (
  <Fragment>
    <Grid className={styles.priceWrapper} wrap>
      <Grid.Item grow={1}>
        <Price
          currency={price.currency}
          discounted={!!price.discount}
          unitPrice={price.unitPrice}
          unitPriceMin={price.unitPriceMin}
        />
      </Grid.Item>
      {(price.msrp > 0 && price.unitPrice !== price.msrp) && (
        <Grid.Item>
          <PriceStriked
            className={styles.strikedPrice}
            value={price.msrp}
            currency={price.currency}
          />
        </Grid.Item>
      )}
      {(!price.msrp && price.unitPriceStriked > 0) && (
        <Grid.Item>
          <PriceStriked
            className={styles.strikedPrice}
            value={price.unitPriceStriked}
            currency={price.currency}
          />
        </Grid.Item>
      )}
    </Grid>
    {price.info && (
      <Grid>
        <Grid.Item>
          <PriceInfo className={styles.basicPrice} text={price.info} />
        </Grid.Item>
      </Grid>
    )}
  </Fragment>
);

ProductGridPrice.propTypes = {
  price: PropTypes.shape().isRequired,
};

export default withPriceCalculation(ProductGridPrice);
