// @flow
import React, { useContext } from 'react';
import { ProductImage } from '../../../product';
import { FulfillmentContext } from '../../locations.context';
import StoreListProductName from './StoreListProductName';
import StoreListProductInfo from './StoreListProductInfo';
import * as styles from './StoreListProduct.style';

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
  );
}

export default StoreListProduct;
