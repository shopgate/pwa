/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const button = css({
  display: 'block',
  position: 'relative',
  background: '#fff',
  borderRadius: '50%',
  padding: 0,
  fontSize: 20,
  lineHeight: 1,
  color: colors.accent,
  outline: 0,
  zIndex: 15, // Should overlap the gallery bullets
}).toString();

const ripple = css({
  padding: 6,
}).toString();

export default {
  button,
  ripple,
};
