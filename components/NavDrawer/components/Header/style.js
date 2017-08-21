/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import { light, accent } from 'Styles/colors';
import { gap } from 'Styles/variables';

const container = cxs({
  marginBottom: 4,
});

const loggedIn = cxs({
  background: accent,
  color: light,
  padding: `${gap.small + 1}px ${gap.big}px ${gap.small - 1}px`,
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
