/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const name = css({
  fontWeight: 'bold',
  fontSize: '1.25rem',
  lineHeight: '1.25',
  marginBottom: 2,
  marginRight: 72,
}).toString();

const placeholder = css({
  width: '70%',
  height: 24,
  marginTop: 5,
}).toString();

export default {
  name,
  placeholder,
};
