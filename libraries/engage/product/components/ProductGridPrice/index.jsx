import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Price, PriceStriked,
} from '@shopgate/engage/components';
import { PriceInfo } from '@shopgate/engage/product/components';
import { withPriceCalculation } from '@shopgate/engage/product/hocs';
import { makeStyles } from '@shopgate/engage/styles';
import { themeName } from '@shopgate/pwa-common/helpers/config';

const isIOS = themeName.includes('ios');

const useStyles = makeStyles()({
  priceWrapper: isIOS ? {
    lineHeight: 1.75,
    marginTop: 2,
    alignItems: 'center',
  } : {
    lineHeight: 1.75,
  },
  basicPrice: {
    fontSize: '0.875rem',
  },
  strikedPrice: isIOS ? {
    fontSize: '0.75rem',
  } : {},
});

/**
 * The ProductGridPrice component is supposed to be used to display prices at product grids. It
 * renders a row with the current price and a strike price when present. As same as the price info.
 * @param {Object} product A product entity.
 * @return {JSX.Element}
 */
const ProductGridPrice = ({ product }) => {
  const { classes } = useStyles();
  const { price } = product;

  return (
    <>
      <Grid className={`${classes.priceWrapper} engage__product__product-grid-price`} wrap>
        <Grid.Item grow={1}>
          <Price
            currency={price.currency}
            discounted={!!price.discount}
            unitPrice={price.unitPrice}
            unitPriceMin={price.unitPriceMin}
            unitPriceMax={price.unitPriceMax}
          />
        </Grid.Item>
        {(price.msrp > 0 && price.unitPrice !== price.msrp) && (
          <Grid.Item>
            <PriceStriked
              className={classes.strikedPrice}
              value={price.msrp}
              currency={price.currency}
            />
          </Grid.Item>
        )}
        {(!price.msrp &&
          price.unitPriceStriked > 0 &&
          price.unitPrice !== price.unitPriceStriked
        ) && (
          <Grid.Item>
            <PriceStriked
              className={classes.strikedPrice}
              value={price.unitPriceStriked}
              currency={price.currency}
            />
          </Grid.Item>
        )}
      </Grid>
      <PriceInfo
        product={product}
        className={classes.basicPrice}
        wrapper={children =>
          <Grid>
            <Grid.Item>
              {children}
            </Grid.Item>
          </Grid>}
      />
    </>
  );
};

ProductGridPrice.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default withPriceCalculation(ProductGridPrice);
