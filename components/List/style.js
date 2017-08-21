/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import colors from 'Styles/colors';

const item = cxs({
  marginLeft: 72,
});

const itemNotLast = cxs({
  boxShadow: `0 1px 0 0 ${colors.darkGray}`,
  marginBottom: 1,
});

const innerContainer = cxs({
  marginLeft: -72,
  minHeight: 56,
  position: 'relative',
});

const glow = cxs({
  bottom: -1,
  height: '100%',
  top: -1,
});

export default {
  item,
  itemNotLast,
  innerContainer,
  glow,
};
