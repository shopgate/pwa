/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import variables from 'Styles/variables';

/**
 * Styling for the title.
 */
const title = cxs({
  position: 'absolute',
  top: '.65em',
  left: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  padding: `0 ${variables.gap.big}px`,
});

/**
 * Animation configuration
 */
const distance = '20px';
const duration = 300; // The duration of the animation in ms.
const center = {
  opacity: 1,
  transform: 'translate3d(0, 0, 0)',
};
const right = {
  opacity: 0,
  transform: `translate3d(${distance}, 0, 0)`,
};
const left = {
  opacity: 0,
  transform: `translate3d(-${distance}, 0, 0)`,
};

/**
 * Keyframe animation for all title positions.
 */
cxs({
  '@keyframes navTitleCenterToRight': {
    from: center,
    to: right,
  },
  '@keyframes navTitleCenterToLeft': {
    from: center,
    to: left,
  },
  '@keyframes navTitleRightToCenter': {
    from: right,
    to: center,
  },
  '@keyframes navTitleLeftToCenter': {
    from: left,
    to: center,
  },
});

/**
 * Creates a simple class that is using a keyframe
 * @param {string} name The name of the keyframe
 * @returns {string} Class name
 */
const createKeyframeAnimationClass = name => cxs({
  animation: `navTitle${name} ${duration}ms cubic-bezier(0.25, 1, 0.25, 1)`,
});

const hidden = cxs({
  opacity: 0,
});

export default {
  title,
  hidden,
  centerToRight: createKeyframeAnimationClass('CenterToRight'),
  centerToLeft: createKeyframeAnimationClass('CenterToLeft'),
  rightToCenter: createKeyframeAnimationClass('RightToCenter'),
  leftToCenter: createKeyframeAnimationClass('LeftToCenter'),
};
