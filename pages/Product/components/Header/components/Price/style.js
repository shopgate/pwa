/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const placeholder = css({
  height: 20,
  width: '50px',
  display: 'inline-block',
}).toString();

const price = css({
  fontSize: '1.25rem',
  justifyContent: 'flex-end',
  lineHeight: 1,
}).toString();

export default {
  placeholder,
  price,
};
