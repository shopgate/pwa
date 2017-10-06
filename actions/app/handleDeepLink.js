/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ParsedLink from '../../components/Router/helpers/parsed-link';
import { history } from '../../helpers/router';
import openDeepLink from '../../action-creators/app/openDeepLink';
import successOpenDeepLink from '../../action-creators/app/successOpenDeepLink';
import errorOpenDeepLink from '../../action-creators/app/errorOpenDeepLink';

/**
 * Opens a DeepLink.
 * @param {Object} [payload={}] The deep link event payload.
 * @return {Function} A redux thunk.
 */
const handleDeepLink = (payload = {}) => (dispatch) => {
  const { link = null } = payload;

  if (!link) {
    dispatch(errorOpenDeepLink());
    return;
  }

  dispatch(openDeepLink(link));

  const parsedLink = new ParsedLink(link);
  parsedLink.open(history, () =>
    dispatch(successOpenDeepLink(link))
  );
};

export default handleDeepLink;
