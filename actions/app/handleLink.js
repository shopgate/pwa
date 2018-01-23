/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ParsedLink from '../../components/Router/helpers/parsed-link';
import { history } from '../../helpers/router';

/**
 * Opens a DeepLink.
 * @param {Object} [payload={}] The deep link event payload.
 * @return {boolean} True if the parsed link handled the link.
 */
const handleLink = (payload = {}) => {
  const { link = null } = payload;

  if (!link) {
    return false;
  }

  const parsedLink = new ParsedLink(link);

  parsedLink.open(history);

  return true;
};

export default handleLink;
