import React, { Component, PropTypes } from 'react';
import FilterBar from 'Components/FilterBar';
import View from 'Components/View';
import ViewContent from 'Components/ViewContent';
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
      <View>
        <ViewContent title={this.props.searchPhrase}>
          {this.props.hasProducts && <FilterBar />}
          {this.props.hasProducts && <Products />}
          <NoResults
            headlineText="search.no_result.heading"
            bodyText="search.no_result.body"
            searchPhrase={this.props.searchPhrase}
          />
        </ViewContent>
      </View>
    );
  }
}

// TODO: const enhance = compose(
//   TODO: connect.filters,
//   TODO: connect.search,
//   NoBackgroundRender
// );

export default connect(Search);
