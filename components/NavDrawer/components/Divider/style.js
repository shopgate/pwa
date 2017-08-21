/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const divider = cxs({
  height: 1,
  margin: `${variables.gap.big}px 0`,
  background: colors.shade7,
  border: 0,
});

export default {
  divider,
};
