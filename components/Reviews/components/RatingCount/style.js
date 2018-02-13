/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const main = {
  fontSize: 12,
  margin: '0 0.5em',
  lineHeight: '2em',
};

const greyStyle = css({
  ...main,
  color: colors.shade3,
  fontSize: 12,
}).toString();

const prominentStyle = css({
  ...main,
  color: colors.primary,
}).toString();

export {
  greyStyle,
  prominentStyle,
};

