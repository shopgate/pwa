import { openDeepLink } from '../../action-creators/app';
import handleLink from './handleLink';

/**
 * Opens a DeepLink.
 * @param {Object} [payload={}] The deep link event payload.
 * @return {Function} A redux thunk.
 */
export default function handleDeepLink(payload = {}) {
  return (dispatch) => {
    dispatch(handleLink(payload));
    dispatch(openDeepLink(payload));
  };
}
