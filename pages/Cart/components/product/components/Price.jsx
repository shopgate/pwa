import React, { PropTypes } from 'react';
import { Grid } from 'Library/components';
import {
  Price,
  PriceStriked,
} from 'Templates/components';
import styles from '../style';

/**
 * The CouponPrice component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const ProductPrice = props => (
  <Grid.Item shrink={0}>
    { !!props.specialPrice &&
      <PriceStriked
        className={styles.priceStriked}
        value={props.defaultPrice}
        currency={props.currency}
      />
    }
    <Price
      className={styles.price}
      unitPrice={props.specialPrice || props.defaultPrice}
      currency={props.currency}
      discounted={!!props.specialPrice}
    />
  </Grid.Item>
);

ProductPrice.propTypes = {
  currency: PropTypes.string.isRequired,
  defaultPrice: PropTypes.number.isRequired,
  specialPrice: PropTypes.number,
};

ProductPrice.defaultProps = {
  specialPrice: null,
};

export default ProductPrice;
