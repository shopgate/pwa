import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { NoResults } from '@shopgate/engage/components';
import { DEFAULT_SORT } from '@shopgate/engage/core';
import { RouteContext } from '@shopgate/engage/core';
import { BackBar } from 'Components/AppBar/presets';
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
      searchPhrase, showFilterBar, showNoResults,
    } = this.props;

    return (
      <RouteContext.Consumer>
        {({ state, query, id: routeId }) => (
          <Fragment>
            <BackBar
              title={searchPhrase}
              {...showFilterBar && { below: <Bar key="below" /> }}
            />
            <Products
              searchPhrase={searchPhrase}
              filters={state.filters}
              sort={query.sort || DEFAULT_SORT}
              routeId={routeId}
            />
            {showNoResults && (
              <NoResults
                headlineText="search.no_result.heading"
                bodyText="search.no_result.body"
                searchPhrase={searchPhrase}
              />
            )}
          </Fragment>
        )}
      </RouteContext.Consumer>
    );
  }
}

export default connect(SearchContent);
