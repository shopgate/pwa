import { ACTION_PUSH, ACTION_RESET } from '@virtuous/conductor/constants';
import { navigate } from '../../action-creators/router';
import { INDEX_PATH_DEEPLINK } from '../../constants/RoutePaths';

/**
 * @param {Object} payload The link payload.
 * @return {Function}
 */
export default function handleLink(payload) {
  return (dispatch) => {
    const { link = null } = payload;

    if (!link) {
      return;
    }

    if (link.startsWith(INDEX_PATH_DEEPLINK)) {
      /**
       * Special treatment for the index page. To avoid multiple index pages within the history,
       * the parsed link helper will only emit the openLink events for the link to inform the
       * streams, but not open a real page. Additionally the history is reset.
       */
      dispatch(navigate(ACTION_RESET));
      return;
    }

    dispatch(navigate(ACTION_PUSH, link));
  };
}
