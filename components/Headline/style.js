/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const headline = css({
  fontSize: 18,
  margin: `${variables.gap.big * 2}px 0 ${variables.gap.big}px`,
  textAlign: 'center',
}).toString();

export default {
  headline,
};
