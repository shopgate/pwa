/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

export default css({
  ' img': {
    display: 'initial',
  },
  // Clearfix for floated widget content
  ':after': {
    clear: 'both',
    content: '.',
    display: 'block',
    visibility: 'hidden',
    height: 0,
  },
}).toString();
