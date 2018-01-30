/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const item = css({
  position: 'relative',
  whiteSpace: 'nowrap',
  padding: `${variables.gap.big * 0.875}px ${variables.gap.big * 1.375}px`,
  lineHeight: 1,
  zIndex: 1,
}).toString();

export default { item };
