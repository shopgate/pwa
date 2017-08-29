import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import NoBackgroundRender from '@shopgate/pwa-common/components/Router/components/NoBackgroundRender';
import CategoryList from 'Components/CategoryList';
import FilterBar from 'Components/FilterBar';
import View from 'Components/View';
import ViewContent from 'Components/ViewContent';
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
    isRoot: PropTypes.bool,
  };

  static defaultProps = {
    category: null,
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
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <View>
        <ViewContent title={this.title}>
          <FilterBar />
          <CategoryList />
          <Products />
          <Empty
            headlineText="category.no_result.heading"
            bodyText="category.no_result.body"
            searchPhrase={this.title}
          />
        </ViewContent>
      </View>
    );
  }
}

const enhance = compose(
  connect,
  NoBackgroundRender
);

export default enhance(Category);
