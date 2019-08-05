import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import NoResults from '@shopgate/pwa-ui-shared/NoResults';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import { RouteContext } from '@shopgate/pwa-common/context';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { NO_RESULTS_CONTENT } from '@shopgate/pwa-common/constants/Portals';
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
              <SurroundPortals portalName={NO_RESULTS_CONTENT}>
                <NoResults
                  headlineText="search.no_result.heading"
                  bodyText="search.no_result.body"
                  searchPhrase={searchPhrase}
                />
              </SurroundPortals>
            )}
          </Fragment>
        )}
      </RouteContext.Consumer>
    );
  }
}

export default connect(SearchContent);
