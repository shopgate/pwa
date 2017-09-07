/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const overlay = css({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'auto',
  zIndex: 1,
  outline: 0,
}).toString();

const rotatedIcon = css({
  transform: 'rotate(180deg)',
}).toString();

export default {
  overlay,
  rotatedIcon,
};
