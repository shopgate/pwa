import { ACTION_REPLACE } from '@virtuous/conductor';
import { navigate } from '../../action-creators/router';
import { mutable } from '../../helpers/redux';

/**
 * @mixes {MutableFunction}
 * @param {Object} params The history params.
 * @param {Object} [options={}] Additional options for the action
 * @param {boolean} [options.remountRoute=true] When set to "true", the target route will be forced
 * to remount.
 * @return {Function} The dispatched action.
 */
export const historyReplace = mutable((params, options = {}) => (dispatch) => {
  dispatch(navigate({
    ...params,
    ...(options?.remountRoute !== false && {
      state: {
        ...params.state,
        /**
         * When a route is "replaced" the router doesn't assign a new route id to the old route
         * stack entry. This can cause issues when a route is replaced by itself, since the content
         * will not remount out of the box.
         *
         * When the "replaceRouteId" state prop is injected, the Route component performs logic
         * to enforce re-remounting routes which where replaced by itself.
         */
        replaceRouteId: Math.random().toString(36).substring(2, 7),
      },
    }),
    action: ACTION_REPLACE,
  }));
});
