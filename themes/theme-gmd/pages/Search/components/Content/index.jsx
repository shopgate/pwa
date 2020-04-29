import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import NoResults from '@shopgate/pwa-ui-shared/NoResults';
import { AppBar } from '@shopgate/pwa-ui-material';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import { RouteContext } from '@shopgate/pwa-common/context';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { NO_RESULTS_CONTENT } from '@shopgate/pwa-common/constants/Portals';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { DefaultBar } from 'Components/AppBar/presets';
import { TOGGLE_SEARCH } from 'Components/Search/constants';
import Bar from '../Bar';
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
   * @returns {JSX}
   */
  getAppBar = () => {
    const { searchPhrase, showFilterBar } = this.props;
    return (
      <DefaultBar
        center={<AppBar.Title title={searchPhrase} onClick={this.showSearch} />}
        below={<Bar showFilterBar={showFilterBar} />}
      />
    );
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      searchPhrase, showNoResults,
    } = this.props;

    return (
      <RouteContext.Consumer>
        {({ state, query, id: routeId }) => (
          <Fragment>
            <ResponsiveContainer appAlways breakpoint="<=xs">
              { this.getAppBar() }
            </ResponsiveContainer>
            <ResponsiveContainer webOnly breakpoint=">xs">
              { this.getAppBar() }
            </ResponsiveContainer>
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
                  className={emptyWrapper}
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
