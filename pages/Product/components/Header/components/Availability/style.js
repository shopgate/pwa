/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const placeholder = css({
  height: 16,
  width: '70%',
  marginTop: 5,
  marginBottom: 2,
}).toString();

const availability = css({
  fontSize: '0.875rem',
}).toString();

export default {
  placeholder,
  availability,
};
