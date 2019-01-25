import { ACTION_REPLACE } from '@shopgate/pwa-common/helpers/router';
import { navigate } from '../../action-creators/router';

/**
 * @param {Object} params The history params.
 * @return {Function} The dispatched action.
 */
export function historyReplace(params) {
  return (dispatch) => {
    dispatch(navigate({
      ...params,
      action: ACTION_REPLACE,
    }));
  };
}
