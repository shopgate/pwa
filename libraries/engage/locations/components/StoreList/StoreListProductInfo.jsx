import React, { useContext } from 'react';
import { Grid, ProductProperties } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { ProductGridPrice } from '../../../product';
import { FulfillmentContext } from '../../locations.context';

const useStyles = makeStyles()(theme => ({
  productInfo: {
    alignItems: 'flex-end',
    color: theme.palette.text.primary,
  },
  productInfoLeft: {
    fontSize: '0.875rem',
    color: themeColors.shade11,
  },
  priceInfo: {
    color: theme.palette.primary.main,
    flexGrow: 0,
    textAlign: 'right',
    wordBreak: 'break-word',
    ' > ul ': {
      flexDirection: 'column-reverse',
    },
  },
}));

/**
 * Renders the product information of the store list.
 * @returns {JSX}
 */
function StoreListProductInfo() {
  const { classes } = useStyles();
  const { product } = useContext(FulfillmentContext);
  if (!product) {
    return null;
  }

  const { characteristics } = product;

  return (
    <Grid className={classes.productInfo}>
      <Grid.Item grow={1} className={classes.productInfoLeft}>
        {characteristics && <ProductProperties properties={characteristics} />}
      </Grid.Item>
      <Grid.Item shrink={0} className={classes.priceInfo}>
        <ProductGridPrice product={product} />
      </Grid.Item>
    </Grid>
  );
}

export default StoreListProductInfo;
