/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const magnifier = css({
  fill: 'currentColor',
}).toString();

const background = css({
  fill: '#fff',
}).toString();

const circle = css({
  fill: 'currentColor',
  opacity: 0.065,
}).toString();

export default {
  magnifier,
  background,
  circle,
};
