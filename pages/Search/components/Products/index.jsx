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
    hash: PropTypes.string.isRequired,
    searchPhrase: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.shape()),
    totalProductCount: PropTypes.number,
  };

  static defaultProps = {
    products: null,
    totalProductCount: null,
  };

  /**
   * @param {number} offset The offset for the fetching.
   * @returns {Promise}
   */
   fetchProducts = offset => this.props.getProducts(
     this.props.searchPhrase,
     this.props.sort,
     offset || this.props.products.length
   )

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
         requestHash={this.props.hash}
       />
     );
   }
}

export default connect(SearchProducts);
