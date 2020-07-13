import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { parseObjectToQueryString } from '@shopgate/pwa-common/helpers/router';
import { withRoute } from '../../core/hocs/withRoute';
import { SORT_SCOPE_CATEGORY } from '../constants';
import { getSortOptions } from './SortProvider.helpers';
import Context from './SortProvider.context';
import connect from './SortProvider.connector';

/**
 * Sort Provider
 * @returns {JSX}
 */
const SortProvider = ({
  children,
  defaultOrder,
  currentOrder,
  currentRoute,
  historyReplace,
  scope,
  extendedOptionsSupported,
}) => {
  const updateRoute = useCallback((sort) => {
    if (currentRoute.query.sort === sort) {
      return;
    }

    const query = parseObjectToQueryString({
      ...currentRoute.query,
      sort,
    });

    const pathname = `${currentRoute.pathname}${query}`;

    historyReplace({
      pathname,
      state: currentRoute.state,
    });
  }, [currentRoute.pathname, currentRoute.query, currentRoute.state, historyReplace]);

  const options = useMemo(() => {
    let result = getSortOptions(scope, extendedOptionsSupported);

    // Add an "active" flag to the options set
    result = result.map(option => ({
      ...option,
      active: option.value === currentOrder,
    }));

    // Set the first option to "active" when none is flagged yet
    if (!result.find(option => option.active === true)) {
      result[0].active = true;
    }

    return result;
  }, [currentOrder, extendedOptionsSupported, scope]);

  const value = useMemo(() => ({
    defaultOrder,
    currentOrder,
    activeOption: options.find(option => option.active).value,
    options,
    scope,
    updateRoute,
  }), [currentOrder, defaultOrder, options, scope, updateRoute]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

SortProvider.propTypes = {
  currentOrder: PropTypes.string.isRequired,
  defaultOrder: PropTypes.string.isRequired,
  historyReplace: PropTypes.func.isRequired,
  children: PropTypes.node,
  currentRoute: PropTypes.shape(),
  extendedOptionsSupported: PropTypes.bool,
  scope: PropTypes.string,
};

SortProvider.defaultProps = {
  children: null,
  currentRoute: null,
  extendedOptionsSupported: false,
  scope: SORT_SCOPE_CATEGORY,
};

export default withRoute(connect(SortProvider), { prop: 'route' });
