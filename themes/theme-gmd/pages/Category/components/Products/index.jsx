import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core/config/isBeta';
import { ResponsiveContainer } from '@shopgate/engage/components';
import ProductGrid from 'Components/ProductGrid';
import { separator } from './style';
import connect from './connector';

/**
 * The Category products component.
 */
class CategoryProducts extends PureComponent {
  static propTypes = {
    sort: PropTypes.string.isRequired,
    categoryHasChildren: PropTypes.bool,
    categoryId: PropTypes.string,
    getProducts: PropTypes.func,
    hash: PropTypes.string,
    products: PropTypes.arrayOf(PropTypes.shape()),
    totalProductCount: PropTypes.number,
  };

  static defaultProps = {
    categoryId: null,
    categoryHasChildren: false,
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
    const {
      products, categoryHasChildren, totalProductCount, hash,
    } = this.props;

    const hasProducts = Array.isArray(products) && products.length > 0;

    return (
      <Fragment>
        { (categoryHasChildren && hasProducts) && (
          <ResponsiveContainer webOnly breakpoint=">xs">
            <hr className={separator} />
          </ResponsiveContainer>
        )}
        <ProductGrid
          handleGetProducts={this.fetchProducts}
          products={products}
          totalProductCount={totalProductCount}
          requestHash={hash}
        />
      </Fragment>

    );
  }
}

export default connect(CategoryProducts);
