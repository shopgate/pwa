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
  position: 'relative',
});

const grid = cxs({
  alignItems: 'flex-start',
});

const icon = cxs({
  position: 'relative',
  top: variables.gap.big,
  width: 72,
  fontSize: '1.5rem',
  padding: `0 ${variables.gap.big * 2}px 0 ${variables.gap.big}px`,
  color: colors.shade11,
});

const label = cxs({
  display: 'flex',
  alignItems: 'flex-start',
  padding: `${variables.gap.big + 2}px 0`,
  fontSize: '0.875rem',
  fontWeight: 500,
});

const count = cxs({
  backgroundColor: colors.primary,
  color: colors.light,
  fontSize: '0.75rem',
  fontWeight: 700,
  height: variables.gap.big * 1.125,
  minWidth: variables.gap.big * 1.125,
  borderRadius: variables.gap.big * 1.125,
  position: 'relative',
  textAlign: 'center',
  padding: `0 ${variables.gap.small * 0.625}px`,
  margin: `${variables.gap.big * 1.1875}px ${variables.gap.big}px`,
});

const primary = cxs({
  background: colors.primary,
  [`.${icon}`]: {
    color: colors.light,
  },
  [`.${label}`]: {
    color: colors.light,
  },
});

export default {
  container,
  grid,
  icon,
  label,
  count,
  primary,
};
