import React, { useContext } from 'react';
import { Ellipsis } from '@shopgate/engage/components';
import { ProductImage } from '@shopgate/engage/product';
import FulfillmentContext from '../context';
import * as styles from './style';

/**
 * Renders the product information.
 * @returns {JSX}
 */
function Product() {
  const { product, selectedVariants } = useContext(FulfillmentContext);

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
          <div className={styles.productName}>
            <Ellipsis>{product.name}</Ellipsis>
          </div>
          {selectedVariants && selectedVariants.length > 0 && (
            <div className={styles.variants} data-test-id="selected-variants">
              {selectedVariants.map(({ label, value }) => (
                <div key={`${label}-${value}`}>{`${label}: ${value}`}</div>
              ))}
            </div>
          )}
          <div className={styles.availability}>
            <div className={styles.availabilityText}>Ready for pick up in 1-3 days in</div>
            <div className={styles.availabilityStores}>13 Stores</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
