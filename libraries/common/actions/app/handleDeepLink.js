import { openDeepLink } from '../../action-creators/app';
import handleLink from './handleLink';

/**
 * Opens a DeepLink.
 * @param {Object} [payload={}] The deep link event payload.
 * @return {Function} A redux thunk.
 */
const handleDeepLink = (payload = {}) => (dispatch) => {
  dispatch(handleLink(payload));
  dispatch(openDeepLink(payload));
};

export default handleDeepLink;
