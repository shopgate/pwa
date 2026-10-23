import React, { useContext } from 'react';
import { Typography, SafeHtml } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { Ellipsis } from '../../../components';
import { FulfillmentContext } from '../../locations.context';

const useStyles = makeStyles()(theme => ({
  productName: {
    marginBottom: theme.spacing(1),
  },
}));

/**
 * Renders the product's name.
 * @returns {JSX}
 */
function StoreListProductName() {
  const { classes } = useStyles();
  const { baseProduct } = useContext(FulfillmentContext);
  if (!baseProduct) {
    return null;
  }

  return (
    <Typography variant="h3" component="div" className={classes.productName}>
      <Ellipsis><SafeHtml as="span" html={baseProduct.name} /></Ellipsis>
    </Typography>
  );
}

export default StoreListProductName;
