/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { transformDisplayOptions } from '@shopgate/pwa-common/helpers/data';
import { LIST_VIEW } from 'Pages/Category/constants';
import ActionButton from 'Components/ActionButton';
import Headline from 'Components/Headline';
import ProductGrid from 'Components/ProductGrid';
import ProductList from 'Components/ProductList';
import connect from './connector';
import styles from './style';

/**
 * The product widget component.
 */
class ProductsWidget extends Component {
  static propTypes = {
    getProducts: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    settings: PropTypes.shape().isRequired,
    isFetching: PropTypes.bool,
    products: PropTypes.arrayOf(PropTypes.shape()),
    totalProductCount: PropTypes.number,
  };

  static defaultProps = {
    getProducts: () => {},
    isFetching: null,
    products: null,
    totalProductCount: null,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.productCount = props.products.length;
  }

  /**
   * Request the products when the component mounts.
   */
  componentDidMount() {
    if (this.props.products.length === 0) {
      this.getProducts();
    }
  }

  /**
   * When we receive new products then we can adjust the state.
   * @param {Object} nextProps The next set of component props.
   */
  componentWillReceiveProps(nextProps) {
    // Set the total product count.
    this.totalProductCount = nextProps.totalProductCount;

    /**
     * Only update to stop 'fetching' when we receive new products or
     * if we have received all expected products.
     */
    if (
      this.props.products.length !== nextProps.products.length ||
      nextProps.products.length === this.totalProductCount
    ) {
      this.productCount = Math.min(nextProps.products.length, this.totalProductCount);
    }
  }

  /**
   * Only update when we are fetching products or we have new products.
   * @param {Object} nextProps The next set of component props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.isFetching !== nextProps.isFetching ||
      this.props.products.length !== nextProps.products.length
    );
  }

  /**
   * Build the params for requesting products and then make the request.
   */
  getProducts = () => {
    const { getProducts, id } = this.props;
    const { productLimit, queryParams, queryType } = this.props.settings;

    const sort = transformDisplayOptions(this.props.settings.sortOrder);

    const options = {
      limit: productLimit,
      offset: this.productCount,
      sort,
    };

    getProducts(queryType, queryParams, options, id);
  }

  /**
   * Determines whether or not we already have all products.
   * @returns {boolean}
   */
  hasAllProducts = () => (
    this.props.totalProductCount !== null &&
    this.props.products.length >= this.props.totalProductCount
  );

  /**
   * Renders a 'Load More' button if there are more products to load.
   * @returns {JSX}
   */
  renderMoreButton = () => {
    if (
      !this.props.settings.showLoadMore ||
      this.hasAllProducts()
    ) {
      return null;
    }

    return (
      <ActionButton
        loading={this.props.isFetching}
        onClick={this.getProducts}
      >
        <I18n.Text string="common.load_more" />
      </ActionButton>
    );
  };

  /**
   * The render function.
   * @returns {JSX|null}
   */
  render() {
    const { products } = this.props;

    // Don't render if we don't have any products.
    if (!products || !products.length) {
      return null;
    }

    // Only show the number of products that we want, not everything coming via props.
    const productSlice = products.slice(0, this.productCount);
    const {
      headline,
      layout,
      showName,
      showPrice,
      showReviews,
    } = this.props.settings;

    const isList = layout === LIST_VIEW;

    // Flags to enable/disable elements when displaying the products.
    const flags = {
      name: isList ? true : showName,
      price: showPrice,
      reviews: showReviews,
      ...isList && { manufacturer: false },
    };

    // Determine which component to render.
    const ProductComponent = isList ? ProductList : ProductGrid;

    return (
      <div {...isList ? { className: styles.listView } : {}}>
        <Headline text={headline} />
        <ProductComponent
          flags={flags}
          infiniteLoad={false}
          products={productSlice}
        />
        {this.renderMoreButton()}
      </div>
    );
  }
}

export default connect(ProductsWidget);

export { ProductsWidget as Unwrapped };
