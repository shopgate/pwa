/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

export default css({
  display: 'block',
  padding: `${Math.round(variables.gap.big * 0.8)}px ${variables.gap.big}px`,
}).toString();
