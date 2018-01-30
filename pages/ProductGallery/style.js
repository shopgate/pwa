/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const fullSize = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const container = css({
  ...fullSize,
  background: colors.dark,
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}).toString();

const navButton = css({
  position: 'fixed',
  top: 0,
  left: 0,
  width: variables.navigator.height,
  color: colors.light,
  zIndex: 2,
}).toString();

const slider = css({
  height: '100%',
}).toString();

const slide = css({
  position: 'relative',
  width: '100%',
  height: '100%',
}).toString();

const sliderStyles = {
  container: css({
    height: '100%',
  }).toString(),
};

export default {
  container,
  navButton,
  slider,
  slide,
  sliderStyles,
};
