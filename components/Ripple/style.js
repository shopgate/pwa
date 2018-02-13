/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const ripple = css({
  position: 'absolute',
  borderRadius: '50%',
  transformOrigin: '50% 50% 0',
}).toString();

const container = css({
  position: 'absolute',
  zIndex: 0,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}).toString();

export default {
  ripple,
  container,
};
