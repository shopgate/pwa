/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import { light, primary as primaryColor, shade11 } from 'Styles/colors';
import { gap } from 'Styles/variables';

const container = cxs({
  position: 'relative',
});

const grid = cxs({
  alignItems: 'flex-start',
});

const icon = cxs({
  position: 'relative',
  top: gap.big,
  width: 72,
  fontSize: '1.5rem',
  padding: `0 ${gap.big * 2}px 0 ${gap.big}px`,
  color: shade11,
});

const label = cxs({
  display: 'flex',
  alignItems: 'flex-start',
  padding: `${gap.big + 2}px 0`,
  fontSize: '0.875rem',
  fontWeight: 500,
});

const count = cxs({
  backgroundColor: primaryColor,
  color: light,
  fontSize: '0.75rem',
  fontWeight: 700,
  height: gap.big * 1.125,
  minWidth: gap.big * 1.125,
  borderRadius: gap.big * 1.125,
  position: 'relative',
  textAlign: 'center',
  padding: `0 ${gap.small * 0.625}px`,
  margin: `${gap.big * 1.1875}px ${gap.big}px`,
});

const primary = cxs({
  background: primaryColor,
  [`.${icon}`]: {
    color: light,
  },
  [`.${label}`]: {
    color: light,
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
