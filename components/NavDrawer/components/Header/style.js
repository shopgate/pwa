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
  color: colors.accentContrast,
  marginBottom: 4,
}).toString();

const loggedIn = css({
  background: colors.accent,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: variables.navigator.height,
  padding: `${variables.gap.small + 1}px ${variables.gap.big}px ${variables.gap.small - 1}px`,
}).toString();

const ellipsis = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  lineHeight: 1.3,
};

const welcome = css({
  fontWeight: 500,
  ...ellipsis,
}).toString();

const mail = css({
  ...ellipsis,
}).toString();

export default {
  container,
  loggedIn,
  welcome,
  mail,
};
