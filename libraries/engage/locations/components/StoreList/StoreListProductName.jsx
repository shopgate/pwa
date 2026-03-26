import React, { useContext } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Ellipsis } from '../../../components';
import { FulfillmentContext } from '../../locations.context';

const useStyles = makeStyles()(theme => ({
  productName: {
    fontSize: '1.25rem',
    fontWeight: 600,
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
    <div className={classes.productName}>
      {/* eslint-disable-next-line react/no-danger */}
      <Ellipsis><span dangerouslySetInnerHTML={{ __html: baseProduct.name }} /></Ellipsis>
    </div>
  );
}

export default StoreListProductName;
