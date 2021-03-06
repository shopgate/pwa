import { historyPop } from './historyPop';
import { historyReplace } from './historyReplace';

/**
 * Performs a redirect. When the action params contain a location, the current history entry
 * will be replaced with it. Otherwise the current history entry will be popped.
 * @param {Object} params The redirect params.
 * @return {Function} A redux thunk.
 */
export function historyRedirect(params = {}) {
  return (dispatch) => {
    const { location, state } = params;

    if (!location) {
      dispatch(historyPop());
      return;
    }

    dispatch(historyReplace({
      pathname: location,
      state,
    }));
  };
}
