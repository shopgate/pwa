import React, { PureComponent, Fragment } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_HEADER,
  PRODUCT_HEADER_AFTER,
  PRODUCT_HEADER_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { Section } from '@shopgate/engage/a11y';
import { ProductContext, Rating } from '@shopgate/engage/product';
import CTAButtons from './components/CTAButtons';
import Name from './components/Name';
import ProductInfo from './components/ProductInfo';
import styles from './style';

/**
 * The product header component.
 */
class ProductHeader extends PureComponent {
  /**
   * @param {Object} props The consumer props.
   * @returns {JSX}
   */
  consumeRenderer = ({ productId, variantId, options }) => {
    const id = variantId || productId;

    return (
      <div className={`${styles.content} theme__product__header`}>
        <CTAButtons productId={id} />
        <Section title="product.sections.information">
          <Rating productId={productId} />
          <Name productId={id} />
          <ProductInfo productId={id} options={options} variantId={variantId} />
        </Section>
      </div>
    );
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <Fragment>
        <Portal name={PRODUCT_HEADER_BEFORE} />
        <Portal name={PRODUCT_HEADER}>
          <ProductContext.Consumer>
            {this.consumeRenderer}
          </ProductContext.Consumer>
        </Portal>
        <Portal name={PRODUCT_HEADER_AFTER} />
      </Fragment>
    );
  }
}

export default ProductHeader;
