/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = cxs({
  position: 'fixed',
  top: variables.navigator.height,
  borderTop: `${variables.gap.small / 2}px solid ${colors.shade8}`,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.light,
  overflowY: 'scroll',
});

const listItem = cxs({
  fontSize: '1rem',
  fontWeight: 400,
});

export default {
  container,
  listItem,
};
