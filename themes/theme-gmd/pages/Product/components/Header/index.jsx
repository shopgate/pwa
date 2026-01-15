import React, { PureComponent } from 'react';
import {
  PRODUCT_HEADER,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { Section } from '@shopgate/engage/a11y';
import { ResponsiveContainer, SurroundPortals } from '@shopgate/engage/components';
import { Rating } from '@shopgate/engage/product/components';
import { ProductContext } from '@shopgate/engage/product/contexts';
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
        <ResponsiveContainer breakpoint="xs" appAlways>
          <CTAButtons productId={id} />
        </ResponsiveContainer>
        <Section title="product.sections.information">
          <Rating productId={productId} />
          <Name productId={id} />
          <ProductInfo productId={id} options={options} />
        </Section>
      </div>
    );
  };

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <SurroundPortals portalName={PRODUCT_HEADER}>
        <ProductContext.Consumer>
          {this.consumeRenderer}
        </ProductContext.Consumer>
      </SurroundPortals>
    );
  }
}

export default ProductHeader;
