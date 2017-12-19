/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const indicator = css({
  position: 'absolute',
  bottom: [
    '2px',
    'calc(2px + constant(safe-area-inset-bottom))',
  ],
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
}).toString();

export default {
  indicator,
};
