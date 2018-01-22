/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const container = css({
  position: 'relative',
}).toString();

const glow = css({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  background: 'transparent',
  transition: 'background 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  zIndex: 0,
}).toString();

export default {
  container,
  glow,
};
