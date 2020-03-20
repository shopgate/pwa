// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export const messagesContainer = css({
  background: colors.light,
  padding: `0 0 ${variables.gap.big}px 0`,
});

export const messages = css({
  borderRadius: '5px 5px 0 0',
  padding: `${variables.gap.small}px ${variables.gap.big * 0.875}px`,
});

export const cartItemTransitionDuration = 300;

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
export const getCartItemTransitionStyle = (state: string) => ({
  ...defaultTransitionStyle,
  ...transitionStyles[state],
});

export default {
  cartItemTransitionDuration,
  getCartItemTransitionStyle,
};
