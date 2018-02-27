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
  position: 'absolute',
  background: colors.accent,
  color: colors.light,
  fontSize: '0.7rem',
  lineHeight: 1.5,
  fontWeight: 'bold',
  borderRadius: variables.gap.small,
  height: variables.gap.big,
  top: -variables.gap.small,
  paddingLeft: variables.gap.small / 2,
  paddingRight: variables.gap.small / 2,
  minWidth: variables.gap.big,
  transform: 'translateX(-50%)',
  left: 'calc(50% + 20px)',
}).toString();
