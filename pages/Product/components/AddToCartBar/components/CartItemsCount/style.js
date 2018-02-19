/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

export const duration = 200;

export const transition = {
  entering: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
    transition: `opacity ${duration}ms, transform ${duration}ms cubic-bezier(0.07,0.29,0.31,1.34)`,
  },
  entered: {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    transition: `opacity ${duration}ms, transform ${duration}ms cubic-bezier(0.07,0.29,0.31,1.34)`,
  },
  exited: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
  },
  exiting: {
    opacity: 0,
    transform: 'translate3d(0, 0, 0)',
  },
};

const container = css({
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
  overflow: 'hidden',
  transform: 'translate3d(0, 100%, 0)',
  willChange: 'transform',
});

const check = css({
  fontSize: '1.2rem',
  paddingRight: variables.gap.small,
});

export default {
  container,
  check,
};
