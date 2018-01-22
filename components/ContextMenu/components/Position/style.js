/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const outerGap = variables.gap.small;

const container = css({
  position: 'absolute',
  margin: outerGap,
}).toString();

export default {
  container,
  outerGap,
};
