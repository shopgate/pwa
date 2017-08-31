import cxs from 'cxs';
import spring from 'css-spring';
import { colors, variables } from 'Templates/styles';

/**
 * Keyframe animations to create spring animation.
 * spring(..) automatically calculates all steps for the keyframe animation.
 */
cxs({
  '@keyframes springFromTop': spring({
    transform: 'translate3d(0, 300%, 0)',
  }, {
    transform: 'translate3d(0, -50%, 0)',
  }, { stiffness: 381.47, damping: 15 }),
});

cxs({
  '@keyframes springFromBottom': spring({
    transform: 'translate3d(0, -300%, 0)',
  }, {
    transform: 'translate3d(0, -50%, 0)',
  }, { stiffness: 381.47, damping: 15 }),
});

cxs({
  '@keyframes springToTop': spring({
    transform: 'translate3d(0, -50%, 0)',
  }, {
    transform: 'translate3d(0, 300%, 0)',
  }, { stiffness: 381.47, damping: 15 }),
});

cxs({
  '@keyframes springToBottom': spring({
    transform: 'translate3d(0, -50%, 0)',
  }, {
    transform: 'translate3d(0, -300%, 0)',
  }, { stiffness: 381.47, damping: 15 }),
});

const springFromBottom = cxs({
  animation: 'springFromBottom 600ms',
});

const springFromTop = cxs({
  animation: 'springFromTop 600ms',
});

const springToTop = cxs({
  animation: 'springToTop 600ms',
});

const springToBottom = cxs({
  animation: 'springToBottom 600ms',
});

/**
 * Circular button and container for the icons.
 */
const button = cxs({
  transition: 'background 450ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  borderRadius: '50%',
  width: 56,
  height: 56,
  position: 'absolute',
  right: variables.gap.big,
  top: -30,
  fontSize: '1.5rem',
  outline: 0,
  boxShadow: '0 8px 13px rgba(0, 0, 0, 0.25)',
  zIndex: 2, // Prevents the icons to be visible outside of the circle
  overflow: 'hidden',
});

/**
 * Styling that is applied to the button when cart icon is shown.
 */
const buttonReady = cxs({
  background: colors.primary,
  color: colors.light,
});

/**
 * Styling that is applied to the button when checkmark is shown.
 */
const buttonSuccess = cxs({
  background: colors.light,
  color: colors.primary,
});

/**
 * Basic icon style that is always applied to all icons.
 */
const icon = cxs({
  transition: 'opacity 450ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  opacity: 1,
  position: 'absolute',
  left: 0,
  right: 0,
  height: 24,
  width: 24,
  top: '50%',
  margin: 'auto',
});

/**
 * Icon style that is applied only to the spinner icon.
 */
const spinnerIcon = cxs({
  transform: 'translate3d(0, -50%, 0)',
});

export default {
  button,
  buttonReady,
  buttonSuccess,
  icon,
  spinnerIcon,
  springFromBottom,
  springFromTop,
  springToBottom,
  springToTop,
};
