import { merge } from 'lodash';
// Imported from the defining modules rather than a barrel: this module runs at import time in
// every spec that touches the theme, and specs that replace a barrel with a partial mock would
// leave these undefined.
import { isDev } from '@shopgate/pwa-common/helpers/environment';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const {
  fontWeight: buttonFontWeight = 600,
  textTransform: buttonTextTransform,
} = themeConfig?.variables?.buttonBase ?? {};

const caseAllCaps = {
  textTransform: 'uppercase',
};
const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';

/**
 * Prefix of the custom properties that cssVarsParser derives from the `typography` keys. Matches
 * the `--sg-` default of `cssVarPrefix` (createTheme/index.ts) and is kept in sync manually, same
 * as the hardcoded names in styles/reset/root.js.
 */
const CSS_VAR_TYPOGRAPHY_PREFIX = '--sg-typography';

/**
 * Creates the typography object for the theme.
 * @param {Object} palette The theme palette.
 * @param {Object|Function} typography The typography options or a function that returns them.
 * @returns {Object} The typography object.
 * @see @link{https://material.io/design/typography/the-type-system.html}
 * @see @link{https://material.io/design/typography/understanding-typography.html}
 */
export default function createTypography(palette, typography) {
  const {
    fontFamily = defaultFontFamily,
    // The default font size of the Material Specification.
    fontSize = 14,
    fontWeightLight = 300,
    fontWeightRegular = 400,
    fontWeightMedium = 500,
    fontWeightBold = 700,
    // Tell the theme what's the font-size on the html element.
    // 16px is the default font-size used by browsers.
    htmlFontSize = 16,
    // Apply the CSS properties to all the variants.
    allVariants,
    pxToRem: pxToRem2,
    ...other
  } = typeof typography === 'function' ? typography(palette) : typography;

  if (isDev) {
    if (typeof fontSize !== 'number') {
      // eslint-disable-next-line no-console
      console.error('Shopgate Theme: `fontSize` is required to be a number.');
    }
  }

  const coef = fontSize / 14;

  const fontWeights = {
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold,
  };

  /**
   * Builds a reference to one of the shared font weight custom properties. The property itself is
   * emitted by cssVarsParser from `typography.fontWeight*`, so overriding it on `:root` (admin css,
   * live preview, an extension) cascades into every variant that uses that token. The resolved
   * weight stays as the fallback, so the variant still renders when the property is absent.
   * @param {string} token One of `fontWeightLight`, `fontWeightRegular`, `fontWeightMedium`,
   * `fontWeightBold`.
   * @returns {string} The css var reference.
   */
  const fontWeightVar = token =>
    `var(${CSS_VAR_TYPOGRAPHY_PREFIX}-${token}, ${fontWeights[token]})`;

  /**
   * Calculates a rem value for a passed pixel value.
   * @param {number} size The source value in pixels.
   * @returns {string} The result value in rem.
   */
  const pxToRem = (size => `${(size / htmlFontSize) * coef}rem`);

  /**
   * Creates a typography variant object.
   * @param {string} fontWeightToken The name of the shared font weight token to use, e.g.
   * `fontWeightBold`. The variant references it as a custom property instead of inlining its value.
   * @param {number} size Font size in pixels.
   * @param {number} lineHeight Line height as a unitless number.
   * @param {Object} casing Casing styles to apply, e.g. textTransform.
   * @returns {Object} The typography variant object.
   */
  const buildVariant = (fontWeightToken, size, lineHeight, casing) => ({
    fontFamily,
    fontWeight: fontWeightVar(fontWeightToken),
    fontSize: pxToRem(size),
    lineHeight,
    ...casing,
    ...allVariants,
  });

  const variants = {
    h1: buildVariant('fontWeightBold', 34, 1.15),
    h2: buildVariant('fontWeightBold', 22, 1.3),
    h3: buildVariant('fontWeightMedium', 20, 1.35),
    h4: buildVariant('fontWeightMedium', 18, 1.4),
    h5: buildVariant('fontWeightMedium', 16, 1.5),
    h6: buildVariant('fontWeightMedium', 14, 1.5),
    subtitle1: buildVariant('fontWeightRegular', 16, 1.75),
    subtitle2: buildVariant('fontWeightMedium', 14, 1.57),
    body1: buildVariant('fontWeightRegular', 16, 1.5),
    body2: buildVariant('fontWeightRegular', 14, 1.43),
    button: buildVariant(
      buttonFontWeight > fontWeightMedium ? 'fontWeightBold' : 'fontWeightMedium',
      16,
      1.75,
      buttonTextTransform === 'uppercase' ? caseAllCaps : undefined
    ),
    caption: buildVariant('fontWeightRegular', 12, 1.66),
    overline: buildVariant('fontWeightRegular', 12, 2.66, caseAllCaps),
  };

  return merge(
    {
      pxToRem,
      fontFamily,
      fontSize,
      fontWeightLight,
      fontWeightRegular,
      fontWeightMedium,
      fontWeightBold,
      ...variants,
    },
    other
  );
}
