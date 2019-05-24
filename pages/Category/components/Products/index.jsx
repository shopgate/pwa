import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core/config/isBeta';
import ProductGrid from 'Components/ProductGrid';
import connect from './connector';

/**
 * The Category products component.
 */
class CategoryProducts extends PureComponent {
  static propTypes = {
    sort: PropTypes.string.isRequired,
    categoryId: PropTypes.string,
    getProducts: PropTypes.func,
    hash: PropTypes.string,
    products: PropTypes.arrayOf(PropTypes.shape()),
    totalProductCount: PropTypes.number,
  };

  static defaultProps = {
    categoryId: null,
    getProducts() { },
    hash: null,
    products: null,
    totalProductCount: null,
  };

  /**
   * @param {number} offset The offset for the fetching.
   */
  fetchProducts = (offset) => {
    const includeCharacteristics = isBeta();

    this.props.getProducts(
      this.props.categoryId,
      this.props.sort,
      offset || this.props.products.length,
      includeCharacteristics
    );
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <ProductGrid
        handleGetProducts={this.fetchProducts}
        products={this.props.products}
        totalProductCount={this.props.totalProductCount}
        requestHash={this.props.hash}
      />
    );
  }
}

export default connect(CategoryProducts);
