/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const base = css({
  pointerEvents: 'none',
  width: '0%',
  transform: 'translate3d(-100%, 0, 0)',
  transition: 'transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1), min-width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
});

const transform = css(base, {
  width: '65%',
  transform: 'translate3d(0, 0, 0)',
});

export default {
  base,
  transform,
};
