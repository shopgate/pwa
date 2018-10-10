import { historyPush, historyReset } from '../../actions/router';
import { INDEX_PATH_DEEPLINK } from '../../constants/RoutePaths';

/**
 * @param {Object} payload The link payload.
 * @return {Function}
 */
export default function handleLink(payload) {
  return (dispatch) => {
    let { link = null } = payload;

    if (!link) {
      return;
    }

    // Remove the deeplink protocol from the link.
    link = link.replace(/^(.*:)(\/\/)?/, '/');

    if (link.startsWith(INDEX_PATH_DEEPLINK)) {
      /**
       * Special treatment for the index page. To avoid multiple index pages within the history,
       * the parsed link helper will only emit the openLink events for the link to inform the
       * streams, but not open a real page. Additionally the history is reset.
       */
      dispatch(historyReset());
      return;
    }

    dispatch(historyPush({
      pathname: link,
    }));
  };
}
