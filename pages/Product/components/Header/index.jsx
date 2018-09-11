import React from 'react';
import pure from 'recompose/pure';
import CTAButtons from './components/CTAButtons';
import Rating from './components/Rating';
import Name from './components/Name';
import ProductInfo from './components/ProductInfo';
import styles from './style';
import { ProductContext } from './../../context';

/**
 * The ProductHeader component.
 * @returns {JSX}
 */
const ProductHeader = () => (
  <ProductContext.Consumer>
    {({
      productId,
      variantId,
      options,
    }) => {
      const id = variantId || productId;

      return (
        <div className={styles.content}>
          <CTAButtons productId={id} />
          <Rating productId={productId} />
          <Name productId={id} />
          <ProductInfo productId={id} options={options} />
        </div>
        );
      }
    }
  </ProductContext.Consumer>
);

export default pure(ProductHeader);
