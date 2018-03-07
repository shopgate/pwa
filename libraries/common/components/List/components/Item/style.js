/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const item = css({
  display: 'block',
  position: 'relative',
}).toString();

const unselected = css({
  zIndex: 1,
}).toString();

const selected = css({
  zIndex: 2,
}).toString();

export default {
  item,
  selected,
  unselected,
};
