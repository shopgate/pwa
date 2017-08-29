/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

export const cartItemTransitionDuration = 300;

const container = css({
  background: colors.background,
  flexGrow: 1,
  paddingTop: variables.gap.small * 0.5,
  // Has to be this magic number because the Payment Bar is this height.
  paddingBottom: variables.paymentBar.height,
}).toString();

const defaultTransitionStyle = {
  transition: `height ${cartItemTransitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
  opactity: 1,
};

const transitionStyles = {
  exited: {
    height: 0,
    opacity: 0,
  },
  exiting: {
    height: 0,
    opacity: 0,
  },
};

/**
 * Creates an object with style attributes to enable a cart item transition.
 * @param {string} state A state of the react-transition-group/Transition component.
 * @return {Object}
 */
export const getCartItemTransitionStyle = state => ({
  ...defaultTransitionStyle,
  ...transitionStyles[state],
});

export default {
  container,
  cartItemTransitionDuration,
  getCartItemTransitionStyle,
};
