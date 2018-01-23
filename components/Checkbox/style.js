/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const baseIcon = {
  width: 24,
  height: 24,
};

const checkedIcon = css({
  ...baseIcon,
  color: colors.accent,
}).toString();

const uncheckedIcon = css({
  ...baseIcon,
  color: colors.shade6,
}).toString();

export default {
  checkedIcon,
  uncheckedIcon,
};
