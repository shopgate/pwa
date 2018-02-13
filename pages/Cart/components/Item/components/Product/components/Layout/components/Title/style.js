/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const title = css({
  fontWeight: 500,
  lineHeight: 1.125,
}).toString();

const menuContainer = css({
  marginRight: `-${variables.gap.big}px`,
  marginLeft: variables.gap.big,
}).toString();

const menuToggleSize = variables.gap.big * 2;
const menuToggleFontSize = variables.gap.big * 1.5;

const menuToggle = css({
  height: menuToggleSize,
  width: menuToggleSize,
  marginTop: `-${variables.gap.small}px`,
  fontSize: menuToggleFontSize,
  padding: variables.gap.small * 0.5,
}).toString();

export default {
  title,
  menuContainer,
  menuToggle,
};
