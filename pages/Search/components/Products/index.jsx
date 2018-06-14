import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import ProductGrid from 'Components/ProductGrid';
import connect from './connector';

/**
 * The SearchProducts component.
 */
class SearchProducts extends Component {
  static propTypes = {
    getProducts: PropTypes.func.isRequired,
    searchPhrase: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.shape()),
    sortOrder: PropTypes.string,
    totalProductCount: PropTypes.number,
  };

  static defaultProps = {
    products: null,
    sortOrder: DEFAULT_SORT,
    totalProductCount: null,
  };

  fetchProducts = () => {
    this.props.getProducts(
      this.props.searchPhrase,
      this.props.products.length,
      this.props.sortOrder
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
