/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const buttons = css({
  position: 'absolute',
  right: variables.gap.big,
  top: -30,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
}).toString();

const favButton = css({
  marginRight: variables.gap.big,
  boxShadow: '0 8px 13px rgba(0, 0, 0, 0.25)',
  zIndex: 15, // Prevents the icons to be visible outside of the circle
  fontSize: 24,
}).toString();

const ripple = css({
  padding: 8,
}).toString();

export default {
  buttons,
  favButton,
  ripple,
};
