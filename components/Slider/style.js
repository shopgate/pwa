/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const sliderContainer = css({
  position: 'relative',
  maxHeight: '100%',
}).toString();

const sliderInnerContainer = css({
  overflow: 'hidden',
}).toString();

const slideWrapper = css({
  flexShrink: 0,
}).toString();

const sliderItem = css({
  position: 'relative',
  height: '100%',
}).toString();

export default {
  sliderContainer,
  sliderInnerContainer,
  slideWrapper,
  sliderItem,
};
