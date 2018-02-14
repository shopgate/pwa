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
  marginLeft: variables.gap.big,
  padding: `${variables.gap.big}px ${variables.gap.big}px ${variables.gap.big}px 0`,
  borderTop: `1px solid ${colors.shade7}`,
}).toString();
