import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import NoResults from '@shopgate/pwa-ui-shared/NoResults';
import { AppBar } from '@shopgate/pwa-ui-material';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import { RouteContext } from '@shopgate/pwa-common/context';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { NO_RESULTS_CONTENT } from '@shopgate/pwa-common/constants/Portals';
import { CATEGORY_ALL_PATTERN } from '@shopgate/engage/category/constants';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { ProductFilters } from '@shopgate/engage/product/components';
import { DefaultBar } from 'Components/AppBar/presets';
import { TOGGLE_SEARCH } from 'Components/Search/constants';
import Bar from 'Components/PageTitleBar';
import { VIEW_CONTENT } from '@shopgate/engage/core';
import Products from '../Products';
import { emptyWrapper } from './style';
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

  showSearch = () => {
    UIEvents.emit(TOGGLE_SEARCH);
  }

  /**
   * @param {string} categoryName Name of the category
   * @returns {JSX}
   */
  getAppBar = (categoryName = '') => {
    const { searchPhrase, showFilterBar, pattern } = this.props;
    const title = pattern === CATEGORY_ALL_PATTERN ? categoryName || '' : searchPhrase;
    return (
      <DefaultBar
        center={<AppBar.Title title={title} onClick={this.showSearch} />}
        shadow={!showFilterBar}
        below={<Bar showFilterBar={showFilterBar} />}
      />
    );
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      searchPhrase, showNoResults, showFilterBar, pattern,
    } = this.props;

    return (
      <RouteContext.Consumer>
        {({ state, query, id: routeId }) => (
          <Fragment>
            <ResponsiveContainer appAlways breakpoint="<=xs">
              { this.getAppBar(state.categoryName) }
            </ResponsiveContainer>
            <ResponsiveContainer webOnly breakpoint=">xs">
              { this.getAppBar(state.categoryName) }
            </ResponsiveContainer>
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
                    className={emptyWrapper}
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
