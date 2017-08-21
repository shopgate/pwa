/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const header = cxs({
  position: 'fixed',
  height: variables.navigator.height,
  left: 0,
  top: 0,
  width: '100%',
  background: colors.light,
  zIndex: 2,
});

const grid = cxs({
  alignItems: 'center',
  height: '100%',
});

const title = cxs({
  position: 'relative',
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingLeft: variables.gap.big,
  paddingRight: variables.gap.big,
  fontSize: '1.25rem',
  fontWeight: 500,
});

const applyButton = cxs({
  marginRight: 4,
});

export default {
  header,
  grid,
  title,
  applyButton,
};
