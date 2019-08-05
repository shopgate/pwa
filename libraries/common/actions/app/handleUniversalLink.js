import { openUniversalLink } from '../../action-creators/app';
import handleLink from './handleLink';

/**
 * Opens an universal link.
 * @param {Object} [payload={}] The universal link event payload.
 * @return {Function} A redux thunk.
 */
export default function handleUniversalLink(payload) {
  return (dispatch) => {
    dispatch(openUniversalLink(payload));
    dispatch(handleLink(payload));
  };
}
