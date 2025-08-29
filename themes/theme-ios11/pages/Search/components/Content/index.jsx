import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import { RouteContext } from '@shopgate/pwa-common/context';
import { SurroundPortals, NoResults } from '@shopgate/engage/components';
import { NO_RESULTS_CONTENT } from '@shopgate/pwa-common/constants/Portals';
import { CATEGORY_ALL_PATTERN } from '@shopgate/engage/category/constants';
import { BackBar } from 'Components/AppBar/presets';
import { ProductFilters } from '@shopgate/engage/product/components';
import { VIEW_CONTENT } from '@shopgate/engage/core';
import Products from '../Products';
import connect from './connector';

/**
 * The SearchContent component.
 */
class SearchContent extends Component {
  static propTypes = {
    searchPhrase: PropTypes.string.isRequired,
    showFilterBar: PropTypes.bool.isRequired,
    showNoResults: PropTypes.bool.isRequired,
    pattern: PropTypes.string,
  }

  static defaultProps = {
    pattern: null,
  }

  /**
   * @param {Object} nextProps The next component props.
   * @return {JSX}
   */
  shouldComponentUpdate(nextProps) {
    return (
      (this.props.showNoResults !== nextProps.showNoResults)
      || (this.props.showFilterBar !== nextProps.showFilterBar)
      || (this.props.searchPhrase !== nextProps.searchPhrase)
    );
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      searchPhrase, showFilterBar, showNoResults, pattern,
    } = this.props;

    return (
      <RouteContext.Consumer>
        {({ state, query, id: routeId }) => (
          <Fragment>
            <BackBar
              title={pattern === CATEGORY_ALL_PATTERN ? state.categoryName : searchPhrase}
            />
            <ProductFilters
              searchPhrase={searchPhrase}
              showFilters={showFilterBar}
            />
            <SurroundPortals portalName={VIEW_CONTENT}>
              <Products
                searchPhrase={searchPhrase}
                filters={state.filters}
                sort={query.sort || DEFAULT_SORT}
                routeId={routeId}
              />
              {showNoResults && (
              <SurroundPortals portalName={NO_RESULTS_CONTENT}>
                <NoResults
                  headlineText="search.no_result.heading"
                  bodyText="search.no_result.body"
                  {...pattern !== CATEGORY_ALL_PATTERN ? {
                    headlineText: 'search.no_result.heading',
                    bodyText: 'search.no_result.body',
                    searchPhrase,
                  } : {
                    headlineText: 'category.no_result.heading',
                    bodyText: 'category.no_result.body',
                  }}
                />
              </SurroundPortals>
              )}
            </SurroundPortals>
          </Fragment>
        )}
      </RouteContext.Consumer>
    );
  }
}

export default connect(SearchContent);
