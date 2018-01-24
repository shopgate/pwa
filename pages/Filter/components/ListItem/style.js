/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const item = css({
  background: colors.light,
  position: 'relative',
}).toString();

const gridItem = css({
  minWidth: '50%',
}).toString();

const ripple = css({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}).toString();

const rightContainer = css({
  ...gridItem,
  justifyContent: 'flex-end',
  paddingRight: 50,
  overflow: 'hidden',
}).toString();

export default {
  item,
  gridItem,
  ripple,
  rightContainer,
};
