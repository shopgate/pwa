/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const wrapper = css({
  alignItems: 'center',
  left: 0,
  position: 'fixed',
  width: '100%',
  zIndex: 3,
  transition: 'transform 100ms linear',
  willChange: 'transform',
}).toString();

export default {
  wrapper,
};
