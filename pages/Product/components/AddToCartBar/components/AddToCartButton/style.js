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
  right: 0,
  top: 0,
  display: 'block',
  flexGrow: 1,
  background: colors.primary,
  color: colors.primaryContrast,
  fontSize: 16,
  fontWeight: 700,
  borderRadius: 5,
  width: '100%',
  outline: 0,
  transition: 'width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  padding: `${(variables.gap.big * 0.75) - 1}px ${variables.gap.big}px ${(variables.gap.big * 0.75) + 1}px`,
}).toString();
