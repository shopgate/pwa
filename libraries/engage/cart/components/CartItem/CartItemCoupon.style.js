import { css } from 'glamor';

export const container = css({
  marginBottom: 4,
});

export const cartItemTransitionDuration = 300;

const defaultTransitionStyle = {
  transition: `height ${cartItemTransitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
  opacity: 1,
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
