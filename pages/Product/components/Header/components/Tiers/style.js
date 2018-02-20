/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const wrapper = css({
  marginTop: 4,
  fontSize: '0.875rem',
}).toString();

const tier = css({
  display: 'block',
  lineHeight: 1.35,
}).toString();

const price = css({
  fontWeight: 500,
}).toString();

export default {
  price,
  tier,
  wrapper,
};
