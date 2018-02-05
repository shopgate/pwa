/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

css.global('body', {
  userSelect: 'none',
});

export default css({
  minHeight: '100vh',
  overflowX: 'hidden',
  width: '100vw',
  position: 'relative',
}).toString();
