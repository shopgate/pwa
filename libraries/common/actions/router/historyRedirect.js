import { historyPop, historyReplace } from './index';

/**
 * Performs a redirect. When the action params contain a location, the current history entry
 * will be replaced with it. Otherwise the current history entry will be popped.
 * @param {Object} params The redirect params.
 * @return {Function} A redux thunk.
 */
export function historyRedirect(params = {}) {
  return (dispatch) => {
    const { location, state = {} } = params;

    if (location) {
      dispatch(historyReplace({
        pathname: location,
        state,
      }));
    } else {
      dispatch(historyPop());
    }
  };
}
