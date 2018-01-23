/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const wrapper = css({
  background: colors.light,
  padding: variables.gap.big,
}).toString();

const container = css({
  position: 'relative',
  height: 24,
  width: '100%',
  fontSize: '0.875rem',
}).toString();

const label = css({
  position: 'absolute',
  pointerEvents: 'none',
  bottom: 2,
  color: colors.shade4,
}).toString();

const input = css({
  position: 'absolute',
  width: 'calc(100% - 36px)',
  top: 0,
  outline: 0,
  bottom: 6,
}).toString();

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

const icon = css({
  color: colors.primary,
  fontSize: '1.875rem',
  position: 'relative',
  float: 'right',
  top: -10,
  transition: `opacity ${easing}`,
}).toString();

const underlineWrapper = css({
  position: 'absolute',
  width: '100%',
  borderBottom: `1px solid ${colors.shade5}`,
  top: 24,
}).toString();

const underline = css({
  position: 'relative',
  width: '100%',
  top: 1,
  height: 2,
  willChange: 'transform',
  transition: `transform ${easing}`,
  background: colors.primary,
}).toString();

const underlineBlurred = css({
  transform: 'scale3d(0,1,1)',
}).toString();

export default {
  wrapper,
  container,
  label,
  input,
  icon,
  underline,
  underlineWrapper,
  underlineBlurred,
};
