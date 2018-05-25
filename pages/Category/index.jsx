import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import CategoryList from 'Components/CategoryList';
import FilterBar from 'Components/FilterBar';
import View from 'Components/View';
import Products from './components/Products';
import Empty from './components/Empty';

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
        <div />
      </View>
    );
  }
}

export default Category;
