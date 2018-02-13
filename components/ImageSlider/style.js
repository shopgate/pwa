/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const slider = css({
  maxHeight: '100%',
  position: 'relative',
  width: 'auto',
}).toString();

const indicator = css({
  position: 'absolute',
  bottom: 2,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
}).toString();

const dot = {
  display: 'inline-block',
  margin: 5,
  borderRadius: '50%',
  width: variables.gap.small,
  height: variables.gap.small,
};

const inactiveIndicator = css({
  ...dot,
  backgroundColor: colors.shade5,
}).toString();

const activeIndicator = css({
  ...dot,
  backgroundColor: colors.shade6,
}).toString();

const container = css({}).toString();

const slide = css({}).toString();

export default {
  slider,
  indicator,
  inactiveIndicator,
  activeIndicator,
  container,
  slide,
};
