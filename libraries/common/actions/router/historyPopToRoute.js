import { historyPop } from './historyPop';
import { mutable } from '../../helpers/redux';
import {
  getRouterStackIndex,
  makeGetPrevRouteIndexByPattern,
} from '../../selectors/router';

/**
 * @mixes {MutableFunction}
 * @param {Object} [params={}] The history params.
 * @return {Function} The dispatched action.
 */
export const historyPopToRoute = mutable(({ pattern, routeId }) => (dispatch, getState) => {
  const state = getState();

  const getPrevRouteIndexByPatternCart = makeGetPrevRouteIndexByPattern(pattern);
  const nextRouteIndex = getPrevRouteIndexByPatternCart(state, { routeId });
  const currentRouteIndex = getRouterStackIndex(state, { routeId });

  if (currentRouteIndex === null || nextRouteIndex === null || nextRouteIndex === -1) {
    dispatch(historyPop());
  } else {
    const steps = currentRouteIndex - nextRouteIndex;
    dispatch(historyPop({ steps }));
  }
});
