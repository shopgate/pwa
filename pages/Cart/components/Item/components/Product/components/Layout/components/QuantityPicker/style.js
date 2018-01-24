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
  border: 'none',
  background: colors.placeholder,
  display: 'block',
  fontSize: '0.75rem',
  lineHeight: 1,
  textAlign: 'center',
  padding: `${variables.gap.small * 0.75}px ${variables.gap.small}px`,
  outline: 0,
  width: '100%',
}).toString();
