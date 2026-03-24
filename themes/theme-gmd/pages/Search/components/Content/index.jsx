import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
import { VIEW_CONTENT, useScrollContainer } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import Products from '../Products';
import connect from './connector';

const useStyles = makeStyles()({
  withTopPadding: {
    paddingTop: 100,
  },
});

/**
 * The SearchContent component.
 */
// Default shallow compare; a partial custom comparator risks missing props (e.g. `pattern`).
const SearchContent = memo(({
  searchPhrase,
  showNoResults,
  showFilterBar,
  pattern,
}) => {
  const { classes } = useStyles();
  const hasScrollContainer = useScrollContainer();

  const showSearch = useCallback(() => {
    UIEvents.emit(TOGGLE_SEARCH);
  }, []);

  const getAppBar = useCallback((categoryName = '') => {
    const title = pattern === CATEGORY_ALL_PATTERN ? categoryName || '' : searchPhrase;
    return (
      <DefaultBar
        center={<AppBar.Title title={title} onClick={showSearch} />}
        shadow={!showFilterBar}
        below={<Bar showFilterBar={showFilterBar} />}
      />
    );
  }, [searchPhrase, showFilterBar, pattern, showSearch]);

  return (
    <RouteContext.Consumer>
      {({ state, query, id: routeId }) => (
        <>
          <ResponsiveContainer appAlways breakpoint="<=xs">
            {getAppBar(state.categoryName)}
          </ResponsiveContainer>
          <ResponsiveContainer webOnly breakpoint=">xs">
            {getAppBar(state.categoryName)}
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
                  className={classNames({ [classes.withTopPadding]: !hasScrollContainer })}
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
        </>
      )}
    </RouteContext.Consumer>
  );
});

SearchContent.propTypes = {
  searchPhrase: PropTypes.string.isRequired,
  showFilterBar: PropTypes.bool.isRequired,
  showNoResults: PropTypes.bool.isRequired,
  pattern: PropTypes.string,
};

SearchContent.defaultProps = {
  pattern: null,
};

export default connect(SearchContent);
