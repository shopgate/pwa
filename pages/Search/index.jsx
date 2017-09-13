import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'Components/FilterBar';
import View from 'Components/View';
import Products from 'Pages/Category/components/Products';
import NoResults from 'Components/NoResults';
import connect from './connector';

/**
 * The Search view component.
 */
class Search extends Component {
  static propTypes = {
    getSearchResults: PropTypes.func.isRequired,
    setActiveFilters: PropTypes.func.isRequired,
    hasProducts: PropTypes.bool,
    searchPhrase: PropTypes.string,
  };

  static defaultProps = {
    hasProducts: false,
    searchPhrase: '',
  };

  static contextTypes = {
    history: PropTypes.shape(),
  };

  /**
   * Trigger loading of products when the searchPhrase changes.
   * @param {Object} nextProps The props the component will receive.
   */
  componentWillReceiveProps(nextProps) {
    console.warn('componentWillReceiveProps', this.props.searchPhrase, nextProps.searchPhrase);
    if (this.props.searchPhrase !== nextProps.searchPhrase) {
      // Reset active filters.
      this.props.getSearchResults();
      this.props.setActiveFilters({});
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <View title={this.props.searchPhrase}>
        {this.props.hasProducts && <FilterBar />}
        {this.props.hasProducts && <Products />}
        {!this.props.hasProducts && (
          <NoResults
            headlineText="search.no_result.heading"
            bodyText="search.no_result.body"
            searchPhrase={this.props.searchPhrase}
          />
        )}
      </View>
    );
  }
}

export default connect(Search);
