/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CATEGORY_LIST_BEFORE,
  CATEGORY_LIST_AFTER,
  PRODUCT_LIST_BEFORE,
  PRODUCT_LIST_AFTER,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import CategoryList from 'Components/CategoryList';
import FilterBar from 'Components/FilterBar';
import View from 'Components/View';
import Products from './components/Products';
import Empty from './components/Empty';
import connect from './connector';

/**
 * The category view component.
 * @returns {JSX}
 */
class Category extends Component {
  static propTypes = {
    category: PropTypes.shape(),
    hasProducts: PropTypes.bool,
    isFilterBarShown: PropTypes.bool,
    isRoot: PropTypes.bool,
  };

  static defaultProps = {
    category: null,
    hasProducts: false,
    isFilterBarShown: true,
    isRoot: true,
  };

  static contextTypes = {
    history: PropTypes.shape(),
    i18n: PropTypes.func,
  };

  /**
   * Returns the current view title.
   * @return {string} The view title.
   */
  get title() {
    const { __ } = this.context.i18n();

    if (this.props.isRoot) {
      return __('titles.categories');
    }

    return this.props.category ? this.props.category.name : '';
  }

  /**
   * Returns the current category ID.
   * @return {string|null}
   */
  get id() {
    return this.props.category ? this.props.category.id : null;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <View title={this.title}>
        {this.props.isFilterBarShown && <FilterBar />}
        <Portal name={CATEGORY_LIST_BEFORE} />
        <CategoryList />
        <Portal name={CATEGORY_LIST_AFTER} />
        <Portal name={PRODUCT_LIST_BEFORE} />
        {this.props.hasProducts && <Products />}
        <Portal name={PRODUCT_LIST_AFTER} />
        <Empty
          headlineText="category.no_result.heading"
          bodyText="category.no_result.body"
          searchPhrase={this.title}
        />
      </View>
    );
  }
}

export default connect(Category);
