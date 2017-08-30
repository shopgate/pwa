import React, { Component, PropTypes } from 'react';
import FilterBar from 'Components/FilterBar';
import View from 'Components/View';
import ViewContent from 'Components/ViewContent';
import Products from 'Pages/Category/components/Products';
import Empty from 'Pages/Category/components/Empty';
import {
  GRID_VIEW,
  LIST_VIEW,
} from 'Pages/Category/constants';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import connect from './connectors';

/**
 * The Search view component.
 */
class Search extends Component {
  static propTypes = {
    changeSortOrder: PropTypes.func.isRequired,
    getSearchResults: PropTypes.func.isRequired,
    handleOpenFilters: PropTypes.func.isRequired,
    isAnimating: PropTypes.bool.isRequired,
    products: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    setActiveFilters: PropTypes.func.isRequired,
    setViewMode: PropTypes.func.isRequired,
    viewMode: PropTypes.oneOf([GRID_VIEW, LIST_VIEW]).isRequired,
    hasActiveFilters: PropTypes.bool,
    searchPhrase: PropTypes.string,
    sort: PropTypes.string,
    totalProductCount: PropTypes.number,
  };

  static defaultProps = {
    activeFilters: {},
    hasActiveFilters: false,
    searchPhrase: '',
    sort: null,
    totalProductCount: null,
  };

  static contextTypes = {
    history: PropTypes.shape(),
  };

  /**
   * Trigger loading of products when the searchPhrase changes.
   * @param {Object} nextProps The props the component will receive.
   */
  componentWillReceiveProps(nextProps) {
    const { getSearchResults, searchPhrase, sort } = nextProps;

    if (this.props.searchPhrase !== searchPhrase) {
      // Trigger tracking action if search phrase changed.
      this.enableTracking();

      // Reset active filters.
      this.props.setActiveFilters({});

      getSearchResults(searchPhrase, 0, ITEMS_PER_LOAD, sort);
    }
  }

  /**
   * Checks if products are available
   * @return {boolean}
   */
  get hasProducts() {
    return this.props.totalProductCount !== 0;
  }

  /**
   * Fetches products by a given offset and limited number of items.
   * @param {number} offset An offset index from where to start.
   * @param {number} limit The limit of items beginning at offset.
   */
  handleGetProducts = (offset, limit) => {
    const { getSearchResults, searchPhrase, sort } = this.props;

    getSearchResults(searchPhrase, offset, limit, sort);
  };

  /**
   * Rerenders the category page with a different view mode.
   */
  handleToggleViewMode = () => {
    const viewMode = this.props.viewMode === GRID_VIEW ? LIST_VIEW : GRID_VIEW;

    this.props.setViewMode(viewMode);
  };

  /**
   * Changes the sort (Infinity container will be reset)
   * @param {string} sort The sort order for the products.
   */
  handleSortChange = (sort) => {
    if (this.props.sort === sort) {
      return;
    }

    // Trigger tracking action if sorting changed.
    this.enableTracking();

    this.handleGetProducts(0, ITEMS_PER_LOAD);
    this.props.changeSortOrder(sort);
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <View>
        <ViewContent title={this.title}>
          {this.props.isFilterBarShown && <FilterBar />}
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

// TODO: const enhance = compose(
//   TODO: connect.filters,
//   TODO: connect.search,
//   NoBackgroundRender
// );

export default connect(Search);
