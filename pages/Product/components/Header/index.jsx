import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_HEADER,
  PRODUCT_HEADER_AFTER,
  PRODUCT_HEADER_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import CTAButtons from './components/CTAButtons';
import Rating from './components/Rating';
import Name from './components/Name';
import ProductInfo from './components/ProductInfo';
import styles from './style';
import { ProductContext } from './../../context';

/**
 * The product header component.
 */
class ProductHeader extends PureComponent {
  static contextTypes = {
    i18n: PropTypes.func,
  }

  /**
   * @param {Object} props The consumer props.
   * @returns {JSX}
   */
  consumeRenderer = ({ productId, variantId, options }) => {
    const { __ } = this.context.i18n();
    const id = variantId || productId;

    return (
      <section aria-label={__('product.sections.information')} className={styles.content}>
        <CTAButtons productId={id} />
        <Rating productId={productId} />
        <Name productId={id} />
        <ProductInfo productId={id} options={options} />
      </section>
    );
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <Fragment>
        <Portal name={PRODUCT_HEADER_BEFORE} />
        <Portal name={PRODUCT_HEADER} >
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
