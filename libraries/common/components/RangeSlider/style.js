/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const outerRange = css({
  minHeight: 1,
  position: 'relative',
}).toString();

const range = css({
  left: 0,
  right: 0,
  position: 'absolute',
}).toString();

export default {
  outerRange,
  range,
};
