/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const positive = css({
  color: colors.shade4,
  ':before': {
    content: '"+"',
  },
}).toString();

const negative = css({
  color: colors.primary,
}).toString();

export default {
  positive,
  negative,
};
