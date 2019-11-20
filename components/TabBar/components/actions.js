import { historyPush } from '@shopgate/pwa-common/actions/router';
import isTabBarVisible from '../helpers/isTabBarVisible';

/**
 * @param {Object} params Params for the navigate action.
 * @return {Function} A redux thunk.
 */
export const navigate = params => (dispatch, getState) => {
  dispatch(historyPush({
    ...params,
    state: {
      preventA11yFocus: isTabBarVisible(getState(), params.pathname),
    },
  }));
};
