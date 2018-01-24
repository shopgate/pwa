/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  background: colors.light,
}).toString();

const headline = css({
  fontSize: 18,
  padding: `${variables.gap.big}px 0 0`,
  marginTop: 0,
  textAlign: 'center',
}).toString();

export default {
  container,
  headline,
};
