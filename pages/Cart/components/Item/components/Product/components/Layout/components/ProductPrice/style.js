/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const price = css({
  fontSize: '1rem',
  fontWeight: 500,
  textAlign: 'right',
}).toString();

const priceStriked = css({
  fontSize: '.875rem',
  textAlign: 'right',
}).toString();

export default {
  price,
  priceStriked,
};
