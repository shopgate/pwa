/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const favItemTransitionDuration = 500;

const favButtonWrapper = css({
  marginTop: `-${variables.gap.big}px`,
  marginLeft: variables.gap.big,
}).toString();

const row = css({
  padding: variables.gap.big,
  justifyContent: 'space-between',
}).toString();

const leftColumn = css({
  minWidth: 126,
  maxWidth: 170,
  width: '19%',
}).toString();

const rightColumn = css({
  paddingLeft: variables.gap.big,
  // Makes the bottom always aligned to bottom of the image.
  paddingBottom: variables.gap.big,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}).toString();

/**
 * Styling for the wrapping div
 * @type {{overflow: string}}
 */
const itemWrapper = css({
  overflow: 'hidden',
}).toString();

const defaultTransitionStyle = {
  position: 'relative',
  zIndex: 1,
  transition: `margin-top ${favItemTransitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
};

/**
 * Creates an object with style attributes to enable a cart item transition.
 * @param {string} state A state of the react-transition-group/Transition component.
 * @param {boolean} visible Is element visible.
 * @param {number} height Height of the element.
 * @return {Object}
 */
const getFavItemTransitionStyle = (state, visible, height) => (
  css({
    ...defaultTransitionStyle,
    ...!visible && {
      zIndex: 0,
      marginTop: `-${height}`,
    },
  }).toString()
);

export default {
  favButtonWrapper,
  leftColumn,
  rightColumn,
  row,
  itemWrapper,
  favItemTransitionDuration,
  getFavItemTransitionStyle,
};
