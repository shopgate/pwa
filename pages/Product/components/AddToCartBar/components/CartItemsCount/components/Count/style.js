/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

export const duration = 200;
export const durationShort = 50;

export const transition = {
  entering: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
  },
  entered: {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
  exited: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
  },
  exiting: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
    transition: `transform ${durationShort}ms linear`,
  },
};

const container = css({
  transition: `transform ${duration}ms cubic-bezier(0.07,0.29,0.31,1.34), opacity ${duration}ms linear`,
});

export default {
  container,
};
