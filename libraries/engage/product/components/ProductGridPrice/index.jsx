import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Price, PriceStriked,
} from '@shopgate/engage/components';
import { PriceInfo } from '@shopgate/engage/product';
import withPriceCalculation from '../../hocs/withPriceCalculation';
import styles from './style';

/**
 * The ProductGridPrice component is supposed to be used to display prices at product grids. It
 * renders a row with the current price and a strike price when present. As same as the price info.
 * @param {Object} product A product entity.
 * @return {JSX}
 */
const ProductGridPrice = ({ product }) => {
  const { price } = product;

  return (
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
      <PriceInfo
        product={product}
        className={styles.basicPrice}
        wrapper={children =>
          <Grid>
            <Grid.Item>
              {children}
            </Grid.Item>
          </Grid>
        }
      />
    </Fragment>
  );
};

ProductGridPrice.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default withPriceCalculation(ProductGridPrice);
