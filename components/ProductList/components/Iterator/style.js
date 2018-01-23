/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const item = css({
  ':first-child': {
    paddingTop: 0,
  },
  ':last-child': {
    paddingBottom: 4,
  },
  paddingTop: 2,
  paddingBottom: 2,
  position: 'relative',
}).toString();

export default {
  item,
};
