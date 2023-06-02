// @flow
import React, { useContext } from 'react';
import { ProductImage } from '../../../product';
import { FulfillmentContext } from '../../locations.context';
import StoreListProductName from './StoreListProductName';
import StoreListProductInfo from './StoreListProductInfo';
import * as styles from './StoreListProduct.style';
import { SurroundPortals } from '../../../components';
import { FULFILLMENT_SHEET_PRODUCT } from '../../constants/Portals';

/**
 * Renders the product information of the store list.
 * @returns {JSX}
 */
function StoreListProduct() {
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
      <div className={styles.productContainer} role="text">
        <div className={styles.productContainerInner}>
          <div className={styles.productImage}>
            <ProductImage src={product.featuredImageBaseUrl} />
          </div>
          <div className={styles.productContent}>
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
