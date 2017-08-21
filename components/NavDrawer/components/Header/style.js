/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = cxs({
  marginBottom: 4,
});

const loggedIn = cxs({
  background: colors.accent,
  color: colors.light,
  padding: `${variables.gap.small + 1}px ${variables.gap.big}px ${variables.gap.small - 1}px`,
});

const ellipsis = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  lineHeight: 1.3,
};

const welcome = cxs({
  fontWeight: 500,
  ...ellipsis,
});

const mail = cxs({
  ...ellipsis,
});

export default {
  container,
  loggedIn,
  welcome,
  mail,
};
