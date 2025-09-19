import { merge } from 'lodash';
import { isDev } from '@shopgate/engage/core/helpers';

/**
 * Round a number to a fixed precision of five decimal places.
 * @param {number} value The value to round.
 * @returns {number} The rounded value.
 */
function round(value) {
  return Math.round(value * 1e5) / 1e5;
}

const caseAllCaps = {
  textTransform: 'uppercase',
};
const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';

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
    fontSize = 16,
    fontWeightLight = 300,
    fontWeightRegular = 400,
    fontWeightMedium = 500,
    fontWeightBold = 700,
    // Apply the CSS properties to all the variants.
    allVariants,
    pxToRem: pxToRem2,
    ...other
  } = typeof typography === 'function' ? typography(palette) : typography;

  if (isDev) {
    if (typeof fontSize !== 'number') {
      console.error('Shopgate Theme: `fontSize` is required to be a number.');
    }
  }

  /**
   * Calculates a rem value for a passed pixel value.
   * @param {number} size The source value in pixels.
   * @returns {string} The result value in rem.
   */
  const pxToRem = (size => `${round(size / fontSize)}rem`);

  /**
   * Creates a typography variant object.
   * @param {number} fontWeight The font weight to use for the variant.
   * @param {number} size Font size in pixels.
   * @param {number} lineHeight Line height as a unitless number.
   * @param {Object} casing Casing styles to apply, e.g. textTransform.
   * @returns {Object} The typography variant object.
   */
  const buildVariant = (fontWeight, size, lineHeight, casing) => ({
    fontFamily,
    fontWeight,
    fontSize: pxToRem(size),
    lineHeight,
    ...casing,
    ...allVariants,
  });

  const variants = {
    h1: buildVariant(fontWeightBold, 34, 1.15),
    h2: buildVariant(fontWeightBold, 22, 1.3),
    h3: buildVariant(fontWeightMedium, 20, 1.35),
    h4: buildVariant(fontWeightMedium, 18, 1.4),
    h5: buildVariant(fontWeightMedium, 16, 1.5),
    h6: buildVariant(fontWeightMedium, 14, 1.5),
    subtitle1: buildVariant(fontWeightRegular, 16, 1.75),
    subtitle2: buildVariant(fontWeightMedium, 14, 1.57),
    body1: buildVariant(fontWeightRegular, 16, 1.5),
    body2: buildVariant(fontWeightRegular, 14, 1.43),
    button: buildVariant(fontWeightMedium, 14, 1.75, caseAllCaps),
    caption: buildVariant(fontWeightRegular, 12, 1.66),
    overline: buildVariant(fontWeightRegular, 12, 2.66, caseAllCaps),
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
