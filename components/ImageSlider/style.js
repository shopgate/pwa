/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import colors from 'Styles/colors';

const slider = {
  maxHeight: '100%',
  position: 'relative',
  width: 'auto',
};

const indicator = {
  position: 'absolute',
  bottom: 2,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
};

const dot = {
  display: 'inline-block',
  margin: 5,
  borderRadius: '50%',
  width: 8,
  height: 8,
};

const inactiveIndicator = {
  ...dot,
  backgroundColor: '#ccc',
};

const activeIndicator = {
  ...dot,
  backgroundColor: colors.shade6,
};

const container = {};

const slide = {};

export default {
  slider,
  indicator,
  inactiveIndicator,
  activeIndicator,
  container,
  slide,
};
