import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Price, PriceStriked, Typography,
} from '@shopgate/engage/components';
import { PriceInfo } from '@shopgate/engage/product/components';
import { withPriceCalculation } from '@shopgate/engage/product/hocs';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  priceWrapper: {
    marginTop: 4,
    alignItems: 'center',
  },
});

/**
 * The ProductGridPrice component is supposed to be used to display prices at product grids. It
 * renders a row with the current price and a strike price when present. As same as the price info.
 * @param {Object} product A product entity.
 * @return {JSX.Element}
 */
const ProductGridPrice = ({ product }) => {
  const { classes, cx } = useStyles();
  const { price } = product;

  return (
    <>
      <Grid className={cx(classes.priceWrapper, 'engage__product__product-grid-price')} wrap>
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
            <Typography variant="caption" component="span">
              <PriceStriked
                value={price.msrp}
                currency={price.currency}
              />
            </Typography>
          </Grid.Item>
        )}
        {(!price.msrp &&
          price.unitPriceStriked > 0 &&
          price.unitPrice !== price.unitPriceStriked
        ) && (
          <Grid.Item>
            <Typography variant="caption" component="span">
              <PriceStriked
                value={price.unitPriceStriked}
                currency={price.currency}
              />
            </Typography>
          </Grid.Item>
        )}
      </Grid>
      <Typography variant="body2" component="div">
        <PriceInfo
          product={product}
          wrapper={children =>
            <Grid>
              <Grid.Item>
                {children}
              </Grid.Item>
            </Grid>}
        />
      </Typography>
    </>
  );
};

ProductGridPrice.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default withPriceCalculation(ProductGridPrice);
