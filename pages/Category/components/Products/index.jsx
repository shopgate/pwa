import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProductGrid from 'Components/ProductGrid';
import connect from './connector';

/**
 * The Category products component.
 */
class CategoryProducts extends PureComponent {
  static propTypes = {
    categoryId: PropTypes.string,
    getProducts: PropTypes.func,
    products: PropTypes.arrayOf(PropTypes.shape()),
    totalProductCount: PropTypes.number,
  };

  static defaultProps = {
    categoryId: null,
    getProducts: () => { },
    products: null,
    totalProductCount: null,
  };

  fetchProducts = () => {
    this.props.getProducts(this.props.categoryId, this.props.products.length);
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
      />
    );
  }
}

export default connect(CategoryProducts);
