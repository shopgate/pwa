/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import replaceHistory from '@shopgate/pwa-common/actions/history/replaceHistory';

/**
 * Sets the view scroll position to top.
 * @return {Function} A redux thunk.
 */
const setViewScrollToTop = () => (dispatch, getState) => {
  const { history } = getState();

  dispatch(replaceHistory({
    state: {
      ...history.state,
      viewTop: true,
    },
  }));
};

export default setViewScrollToTop;
