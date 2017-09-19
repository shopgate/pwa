/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

export default css({
  color: colors.primary,
  textTransform: 'uppercase',
  width: 'auto',
  padding: `${variables.gap.small}px 0`,
}).toString();
