/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import { shade7 } from 'Styles/colors';
import { gap } from 'Styles/variables';

const divider = cxs({
  height: 1,
  margin: `${gap.big}px 0`,
  background: shade7,
  border: 0,
});

export default {
  divider,
};
