import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

/**
 * The styles for the underline wrapper element.
 */
const underlineWrapper = css({
  position: 'relative',
  width: '100%',
  borderBottom: `1px solid ${themeConfig.colors.shade12}`,
  marginTop: 2,
  marginBottom: 7,
}).toString();

/**
 * The styles for the underline element.
 * @param {boolean} focused Whether the input field is focused.
 * @param {boolean} error Whether the input field shows an error message.
 * @return {string} The style class.
 */
const underline = css({
  position: 'relative',
  width: '100%',
  top: 1,
  borderBottomWidth: 2,
  borderBottomStyle: 'solid',
  willChange: 'transform',
  transition: `transform ${easing}`,
}).toString();

/**
 * Returns the underline style.
 * @param {boolean} focused Is focused set or not.
 * @param {boolean} hasError Has error set or not.
 * @return {Object} style
 */
const underlineStyle = (focused, hasError) => ({
  borderBottomColor: hasError ? themeConfig.colors.error : `var(--color-primary, ${themeConfig.colors.focus})`,
  ...(!focused && !hasError) && { transform: 'scale3d(0,1,1)' },
});

export default {
  underline,
  underlineWrapper,
  underlineStyle,
};
