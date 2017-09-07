/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Subject } from 'rxjs/Subject';

export const mainSubject = new Subject();

/**
 * Connects the redux store with rxJS and observable streams.
 * @param {Object} store The redux store.
 * @return {Function}
 */
const observableMiddleware = store => next => (action) => {
  const prevState = store.getState();
  const result = next(action);

  mainSubject.next({
    action,
    dispatch: store.dispatch,
    getState: store.getState,
    prevState,
  });

  return result;
};

export default observableMiddleware;
