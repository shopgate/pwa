import { navigate } from '../../action-creators/router';
import { INDEX_PATH_DEEPLINK } from '../../constants/RoutePaths';

/**
 * Opens a DeepLink.
 * @param {Object} [payload={}] The deep link event payload.
 * @param {Function} dispatch The redux dispatch function.
 * @return {boolean} True if the parsed link handled the link.
 */
const handleLink = (payload = {}, dispatch) => {
  const { link = null } = payload;

  if (!link) {
    return false;
  }

  if (link.startsWith(INDEX_PATH_DEEPLINK)) {
    /**
     * Special treatment for the index page. To avoid multiple index pages within the history,
     * the parsed link helper will only emit the openLink events for the link to inform the streams,
     * but not open a real page. Additionally the history is reset.
     */
    // TODO: Reset the history here
    // dispatch(resetHistory());
  }

  dispatch(navigate('PUSH', link));

  return true;
};

export default handleLink;
