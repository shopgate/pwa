import React, { useContext } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { ProductImage } from '../../../product';
import { FulfillmentContext } from '../../locations.context';
import StoreListProductName from './StoreListProductName';
import StoreListProductInfo from './StoreListProductInfo';
import { SurroundPortals } from '../../../components';
import { FULFILLMENT_SHEET_PRODUCT } from '../../constants/Portals';

const useStyles = makeStyles()(theme => ({
  productContainer: {
    padding: theme.spacing(2.5, 2.5, 1),
    boxShadow: `inset 0 1px 0 ${themeColors.shade7}`,
  },
  productContainerInner: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  productImage: {
    flex: '0 0 auto',
    width: '2.5rem',
    height: '2.5rem',
    background: themeColors.placeholder,
    marginRight: theme.spacing(2.5),
  },
  productContent: {
    flexGrow: 1,
    display: 'block',
  },
}));

/**
 * Renders the product information of the store list.
 * @returns {JSX.Element}
 */
function StoreListProduct() {
  const { classes } = useStyles();
  const { product } = useContext(FulfillmentContext);
  if (!product) {
    return null;
  }

  /* eslint-disable jsx-a11y/aria-role */
  return (
    <SurroundPortals
      portalName={FULFILLMENT_SHEET_PRODUCT}
      portalProps={{ product }}
    >
      <div className={classes.productContainer} role="text">
        <div className={classes.productContainerInner}>
          <div className={classes.productImage}>
            <ProductImage src={product.featuredImageBaseUrl} />
          </div>
          <div className={classes.productContent}>
            <StoreListProductName />
            <StoreListProductInfo />
          </div>
        </div>
      </div>
    </SurroundPortals>
  );
  /* eslint-enable jsx-a11y/aria-role */
}

export default StoreListProduct;
