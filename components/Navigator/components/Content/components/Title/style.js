/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

/**
 * Animation configuration.
 */
const distance = '20px';

/**
 * Styling for the title.
 */
const title = css({
  animationDuration: '375ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'cubic-bezier(0.25, 1, 0.25, 1)',
  position: 'absolute',
  top: '.65em',
  left: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  padding: `0 ${variables.gap.big}px`,
}).toString();

const navTitleCenterToRight = css.keyframes({
  '0%': {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
  '100%': {
    opacity: 0,
    transform: `translate3d(${distance}, 0, 0)`,
  },
}).toString();

const navTitleCenterToLeft = css.keyframes({
  '0%': {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
  '100%': {
    opacity: 0,
    transform: `translate3d(-${distance}, 0, 0)`,
  },
}).toString();

const navTitleRightToCenter = css.keyframes({
  '0%': {
    opacity: 0,
    transform: `translate3d(${distance}, 0, 0)`,
  },
  '100%': {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
}).toString();

const navTitleLeftToCenter = css.keyframes({
  '0%': {
    opacity: 0,
    transform: `translate3d(-${distance}, 0, 0)`,
  },
  '100%': {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
}).toString();

const centerToRight = css({
  animationName: `${navTitleCenterToRight}`,
}).toString();

const centerToLeft = css({
  animationName: `${navTitleCenterToLeft}`,
}).toString();

const rightToCenter = css({
  animationName: `${navTitleRightToCenter}`,
}).toString();

const leftToCenter = css({
  animationName: `${navTitleLeftToCenter}`,
}).toString();

export default {
  title,
  centerToRight,
  centerToLeft,
  rightToCenter,
  leftToCenter,
};
