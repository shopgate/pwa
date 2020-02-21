import React, { useContext } from 'react';
import { ProductImage } from '../../../product';
import FulfillmentContext from '../context';
import StoreListProductName from './StoreListProductName';
import StoreListProductVariants from './StoreListProductVariants';
import * as styles from './style';

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
          <StoreListProductVariants />
        </div>
      </div>
    </div>
  );
}

export default StoreListProduct;
