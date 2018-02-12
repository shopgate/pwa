/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const buttonSize = 56;
const iconSize = 24;

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
  zIndex: 15, // Prevents the icons to be visible outside of the circle
  fontSize: iconSize,
}).toString();

const cartButton = css({
  fontSize: iconSize,
  paddingLeft: (buttonSize - iconSize) / 2,
  paddingRight: (buttonSize - iconSize) / 2,
  width: buttonSize,
  height: buttonSize,
}).toString();

const ripple = css({
  padding: 8,
}).toString();

export default {
  buttons,
  cartButton,
  favButton,
  ripple,
};
