/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ParsedLink from '../../components/Router/helpers/parsed-link';
import resetHistory from '../history/resetHistory';
import { history } from '../../helpers/router';

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

  if (link === '/index') {
    /**
     * Special treatment for the index page.
     * The history will be reset to avoid multiple index pages within the history.
     */
    dispatch(resetHistory());
  } else {
    const parsedLink = new ParsedLink(link);
    parsedLink.open(history);
  }

  return true;
};

export default handleLink;
