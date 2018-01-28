/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

export default css({
  background: colors.primary,
  color: colors.primaryContrast,
  flexGrow: 1,
  flexShrink: 0,
  fontSize: 16,
  fontWeight: 700,
  minWidth: 64,
  borderRadius: 5,
  padding: `${variables.gap.small - 1}px ${variables.gap.big}px ${variables.gap.small + 1}px`,
}).toString();
