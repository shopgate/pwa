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

  return (
    <SurroundPortals
      portalName={FULFILLMENT_SHEET_PRODUCT}
      portalProps={{ product }}
    >
      <div className={styles.productContainer}>
        <div className={styles.productContainerInner}>
          <div className={styles.productImage}>
            <ProductImage src={product.featuredImageUrl} />
          </div>
          <div className={styles.productContent}>
            <StoreListProductName />
            <StoreListProductInfo />
          </div>
        </div>
      </div>
    </SurroundPortals>
  );
}

export default StoreListProduct;
