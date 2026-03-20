import React, { useContext } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import { Ellipsis } from '../../../components';
import { FulfillmentContext } from '../../locations.context';

const useStyles = makeStyles()({
  productName: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: themeVariables.gap.small,
  },
});

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
      <Ellipsis><span dangerouslySetInnerHTML={{ __html: baseProduct.name }} /></Ellipsis>
    </div>
  );
}

export default StoreListProductName;
