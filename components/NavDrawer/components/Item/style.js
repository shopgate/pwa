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
  position: 'relative',
}).toString();

const grid = css({
  alignItems: 'flex-start',
}).toString();

const icon = css({
  position: 'relative',
  top: variables.gap.big,
  width: 72,
  fontSize: '1.5rem',
  padding: `0 ${variables.gap.big * 2}px 0 ${variables.gap.big}px`,
  color: colors.shade11,
}).toString();

const labelBaseStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: `${variables.gap.big + 2}px 0`,
  fontSize: '0.875rem',
  fontWeight: 500,
};

const label = css(labelBaseStyle).toString();

const labelWithIndicator = css({
  ...labelBaseStyle,
  justifyContent: 'space-between',
  paddingRight: variables.gap.xbig,
  ':after': {
    background: colors.primary,
    borderRadius: '4.5px',
    content: ' ',
    display: 'inline-block',
    height: '9px',
    width: '9px',
    alignSelf: 'center',
    marginRight: -12,
  },
}).toString();

const count = css({
  backgroundColor: colors.primary,
  color: colors.primaryContrast,
  fontSize: '0.75rem',
  fontWeight: 700,
  height: variables.gap.big * 1.125,
  minWidth: variables.gap.big * 1.125,
  borderRadius: variables.gap.big * 1.125,
  position: 'relative',
  textAlign: 'center',
  padding: `0 ${variables.gap.small * 0.625}px`,
  margin: `${variables.gap.big * 1.1875}px ${variables.gap.big}px`,
}).toString();

const primary = css({
  background: colors.primary,
}).toString();

const primaryIcon = css({
  color: colors.primaryContrast,
}).toString();

export default {
  container,
  grid,
  icon,
  label,
  labelWithIndicator,
  count,
  primary,
  primaryIcon,
};
