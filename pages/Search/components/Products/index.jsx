import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProductGrid from 'Components/ProductGrid';
import connect from './connector';

/**
 * The SearchProducts component.
 */
class SearchProducts extends PureComponent {
  static propTypes = {
    getProducts: PropTypes.func.isRequired,
    searchPhrase: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.shape()),
    totalProductCount: PropTypes.number,
  };

  static defaultProps = {
    products: null,
    totalProductCount: null,
  };

  fetchProducts = () => {
    this.props.getProducts(
      this.props.searchPhrase,
      this.props.products.length
    );
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.products) {
      return null;
    }

    return (
      <ProductGrid
        handleGetProducts={this.fetchProducts}
        products={this.props.products}
        totalProductCount={this.props.totalProductCount}
      />
    );
  }
}

export default connect(SearchProducts);
