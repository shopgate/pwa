import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'Components/FilterBar';
import View from 'Components/View';
import Products from 'Pages/Category/components/Products';
import NoResults from '@shopgate/pwa-ui-shared/NoResults';
import connect from './connector';

/**
 * The Search view component.
 */
class Search extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    searchPhrase: PropTypes.string.isRequired,
    isFilterBarShown: PropTypes.bool,
    products: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    products: [],
    isFilterBarShown: true,
  };

  /**
   * Returns the number of received products.
   */
  get hasProducts() {
    return this.props.products.length > 0;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { isLoading, searchPhrase } = this.props;

    return (
      <View title={searchPhrase}>
        {(this.props.isFilterBarShown) && <FilterBar />}
        <Products />
        {(!this.hasProducts && !isLoading) && (
          <NoResults
            headlineText="search.no_result.heading"
            bodyText="search.no_result.body"
            searchPhrase={searchPhrase}
          />
        )}
      </View>
    );
  }
}

export default connect(Search);
