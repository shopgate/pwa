/*
 *  Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Mock for getElementById
 * @param {function} scrollSpy Element.scroll spy function.
 * @returns {function}
 */
const getElementById = scrollSpy => () => ({
  offsetTop: 100,
  closest() {
    return {
      scroll: scrollSpy,
    };
  },
});

export {
  getElementById,
};
