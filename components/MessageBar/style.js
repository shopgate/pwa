/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  display: 'flex',
  flexDirection: 'column',
  background: colors.background,
}).toString();

const messageBase = {
  padding: `${variables.gap.small}px ${variables.gap.big}px`,
  color: colors.light,
  fontSize: '0.875rem',
  fontWeight: 500,
  ':not(:last-child)': {
    marginBottom: variables.gap.small * 0.5,
  },
};

const info = css({
  ...messageBase,
  background: colors.accent,
}).toString();

const error = css({
  ...messageBase,
  background: colors.error,
}).toString();

const warning = css({
  ...messageBase,
  background: colors.warning,
}).toString();

export default {
  container,
  info,
  error,
  warning,
};
