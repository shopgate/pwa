import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_LIST,
  PRODUCT_LIST_AFTER,
  PRODUCT_LIST_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import Products from '../Products';

/**
 * The category products content component.
 */
class ProductsContent extends PureComponent {
  static propTypes = {
    categoryId: PropTypes.string.isRequired,
    hasProducts: PropTypes.bool,
  };

  static defaultProps = {
    hasProducts: false,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { categoryId, hasProducts } = this.props;

    return (
      <Fragment>
        <Portal name={PRODUCT_LIST_BEFORE} props={{ categoryId }} />
        <Portal name={PRODUCT_LIST} props={{ categoryId }}>
          {hasProducts && <Products categoryId={categoryId} />}
        </Portal>
        <Portal name={PRODUCT_LIST_AFTER} props={{ categoryId }} />
      </Fragment>
    );
  }
}

export default ProductsContent;
