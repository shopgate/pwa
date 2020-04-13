import { css } from 'glamor';
import spring from 'css-spring';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const options = {
  stiffness: 381.47,
  damping: 15,
};

const buttonSize = 40;
const iconSize = 20;

/**
 * Keyframe animations to create spring animation.
 * spring(..) automatically calculates all steps for the keyframe animation.
 */
const springFromTopKeyframes = css.keyframes(spring(
  { transform: 'translate3d(0, 300%, 0)' },
  { transform: 'translate3d(0, -50%, 0)' },
  options
));

const springFromBottomKeyframes = css.keyframes(spring(
  { transform: 'translate3d(0, -300%, 0)' },
  { transform: 'translate3d(0, -50%, 0)' },
  options
));

const springToTopKeyframes = css.keyframes(spring(
  { transform: 'translate3d(0, -50%, 0)' },
  { transform: 'translate3d(0, 300%, 0)' },
  options
));

const springToBottomKeyframes = css.keyframes(spring(
  { transform: 'translate3d(0, -50%, 0)' },
  { transform: 'translate3d(0, -300%, 0)' },
  options
));

const springFromBottom = css({
  animation: `${springFromBottomKeyframes} 600ms`,
}).toString();

const springFromTop = css({
  animation: `${springFromTopKeyframes} 600ms`,
}).toString();

const springToTop = css({
  animation: `${springToTopKeyframes} 600ms`,
}).toString();

const springToBottom = css({
  animation: `${springToBottomKeyframes} 600ms`,
}).toString();

/**
 * Circular button and container for the icons.
 * Default styles.
 * @param {number} bSize Size of the button.
 * @param {number} iSize Size of the icon.
 * @return {string} Class name
 */
const buttonWrapperDefault = (bSize, iSize) => ({
  transition: 'background 450ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  borderRadius: '50%',
  width: bSize,
  height: bSize,
  position: 'relative',
  fontSize: iSize,
  outline: 0,
  paddingLeft: (bSize - iSize) / 2,
  paddingRight: (bSize - iSize) / 2,
  zIndex: 2, // Prevents the icons to be visible outside of the circle
  overflow: 'hidden',
});
/**
 * Circular button and container for the icons.
 * @param {number} bSize Size of the button.
 * @param {number} iSize Size of the icon.
 * @return {string} Class name
 */
const buttonWrapper = (bSize, iSize) => css({
  ...buttonWrapperDefault(bSize, iSize),
  boxShadow: themeConfig.shadows.buttons.elevated,
}).toString();

/**
 * Circular button and container for the icons.
 * Without shadow.
 * @param {number} bSize Size of the button.
 * @param {number} iSize Size of the icon.
 * @return {string} Class name
 */
const buttonWrapperNoShadow = (bSize, iSize) => css({
  ...buttonWrapperDefault(bSize, iSize),
}).toString();

/**
 * Styling that is applied to the button when cart icon is shown.
 */
const buttonReady = css({
  background: `var(--color-primary, ${themeConfig.colors.cta})`,
  color: `var(--color-primary-contrast, ${themeConfig.colors.ctaContrast})`,
}).toString();

/**
 * Styling that is applied to the button when checkmark is shown.
 */
const buttonSuccess = css({
  color: `var(--color-primary, ${themeConfig.colors.cta})`,
  background: `var(--color-primary-contrast, ${themeConfig.colors.ctaContrast})`,
}).toString();

/**
 * Styling that is applied to the button when it is disabled.
 */
const buttonDisabled = css({
  background: themeConfig.colors.shade5,
  color: themeConfig.colors.ctaContrast,
  boxShadow: themeConfig.shadows.buttons.disabled,
}).toString();

/**
 * Basic icon style that is always applied to all icons.
 */
const icon = css({
  transition: 'opacity 450ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  opacity: 1,
  position: 'absolute',
}).toString();

/**
 * Icon style that is applied only to the spinner icon.
 */
const spinnerIcon = css({
  left: '50%',
  top: '50%',
  marginTop: -(themeConfig.variables.loadingIndicator.size) / 2,
  marginLeft: -(themeConfig.variables.loadingIndicator.size) / 2,
}).toString();

export default {
  buttonWrapper,
  buttonWrapperNoShadow,
  buttonReady,
  buttonSuccess,
  buttonDisabled,
  buttonSize,
  icon,
  iconSize,
  spinnerIcon,
  springFromBottom,
  springFromTop,
  springToBottom,
  springToTop,
};
