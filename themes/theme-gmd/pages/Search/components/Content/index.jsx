import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { VIEW_CONTENT } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import { UIEvents } from '@shopgate/pwa-core';
import NoResults from '@shopgate/pwa-ui-shared/NoResults';
import { AppBar } from '@shopgate/pwa-ui-material';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import { RouteContext } from '@shopgate/pwa-common/context';
import { NO_RESULTS_CONTENT } from '@shopgate/pwa-common/constants/Portals';
import { CATEGORY_ALL_PATTERN } from '@shopgate/engage/category';
import { DefaultBar } from 'Components/AppBar/presets';
import { TOGGLE_SEARCH } from 'Components/Search/constants';
import Bar from '../Bar';
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

  showSearch = () => {
    UIEvents.emit(TOGGLE_SEARCH);
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
            <DefaultBar
              center={
                <AppBar.Title
                  title={pattern === CATEGORY_ALL_PATTERN ? state.categoryName : searchPhrase}
                  onClick={this.showSearch}
                />
              }
            />

            {showFilterBar && <Bar /> }
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
                    searchPhrase={searchPhrase}
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
