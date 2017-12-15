/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const container = css({
  display: 'flex',
  alignItems: 'center',
}).toString();

const stars = css({
  display: 'inline-block',
  lineHeight: 'initial',
}).toString();

export default {
  container,
  stars,
};
