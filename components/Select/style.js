/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const container = css({
  margin: 0,
  padding: 0,
}).toString();

const selectHandle = css({
  float: 'right',
}).toString();

const items = css({
  position: 'absolute',
  width: '100%',
}).toString();

export default {
  container,
  selectHandle,
  items,
};
