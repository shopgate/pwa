/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const gap = 20;

const item = css({
  marginLeft: gap,
  marginRight: gap,
  borderTop: `0.5px ${colors.dividers} solid`,
  ':last-child': {
    borderBottom: `0.5px ${colors.dividers} solid`,
  },
}).toString();

const innerContainer = css({
  position: 'relative',
}).toString();

export default {
  item,
  innerContainer,
};
