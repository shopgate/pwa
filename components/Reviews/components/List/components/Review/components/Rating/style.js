/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const container = css({
  alignItems: 'center',
  display: 'flex',
  margin: '4px 0',
}).toString();

const stars = css({
  display: 'inline-block',
  lineHeight: 1,
}).toString();

export default {
  container,
  stars,
};
