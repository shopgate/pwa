/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const wrapper = css({
  alignItems: 'center',
  position: 'fixed',
  height: variables.filterbar.height,
  width: '100%',
  zIndex: 3,
  top: variables.navigator.height,
  willChange: 'transform',
}).toString();

const shaded = css({
  boxShadow: variables.navigator.shadow,
}).toString();

export default {
  wrapper,
  shaded,
};
