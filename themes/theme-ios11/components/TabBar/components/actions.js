import { historyPush } from '@shopgate/pwa-common/actions/router';
import isTabBarVisible from '../helpers/isTabBarVisible';
import getTabForPathname, { TAB_ROOTS } from '../helpers/getTabForPathname';
import { getActiveTab, getTabLastRoute } from '../selectors';

/**
 * Resolves where a tap on a tab leads. A tab that is not active reopens the page it showed last,
 * a tap on the active tab leads to its start page. Other links are left alone.
 * @param {Object} state The application state.
 * @param {Object} params Params for the navigate action.
 * @return {Object}
 */
const resolveTabTarget = (state, params) => {
  const tab = getTabForPathname(params.pathname);

  if (TAB_ROOTS[tab] !== params.pathname) {
    return params;
  }

  if (tab === getActiveTab(state)) {
    return params;
  }

  const lastRoute = getTabLastRoute(state, tab);

  if (!lastRoute || lastRoute.pathname === params.pathname) {
    return params;
  }

  return {
    ...params,
    pathname: lastRoute.pathname,
    pattern: lastRoute.pattern,
    state: {
      ...lastRoute.state,
      ...params.state,
    },
  };
};

/**
 * @param {Object} params Params for the navigate action.
 * @return {Function} A redux thunk.
 */
export const navigate = params => (dispatch, getState) => {
  const { pattern, ...target } = resolveTabTarget(getState(), params);
  const reopensLastRoute = target.pathname !== params.pathname;

  dispatch(historyPush({
    ...target,
    state: {
      ...target.state,
      preventA11yFocus: !reopensLastRoute && isTabBarVisible(pattern || target.pathname),
    },
  }));
};
