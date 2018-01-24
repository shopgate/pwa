/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ParsedLink from '../../components/Router/helpers/parsed-link';
import resetHistory from '../history/resetHistory';
import { history } from '../../helpers/router';
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

  const parsedLink = new ParsedLink(link);

  if (link.startsWith(INDEX_PATH_DEEPLINK)) {
    /**
     * Special treatment for the index page. To avoid multiple index pages within the history,
     * the parsed link helper will only emit the openLink events for the link to inform the streams,
     * but not open a real page. Additionally the history is reset.
     */
    parsedLink.open(history, false);
    dispatch(resetHistory());
  } else {
    parsedLink.open(history);
  }

  return true;
};

export default handleLink;
