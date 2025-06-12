// Import the Color constructor from the color.js package
import Color from 'color';

/**
 * Converts any valid input color to an RGBA CSS string.
 * If the input color already contains an alpha channel (< 1), that alpha is preserved.
 * Otherwise, the provided `opacity` is applied.
 *
 * @param {string} inputColor any CSS‐valid color string (hex, rgb(), hsl(), etc.)
 * @param {number} [opacity=1] fallback alpha (0–1) to use if `inputColor` has no alpha
 * @returns {string} "rgba(r, g, b, a)" string
 *
 * @example
 * toRgba('#ff0000')            // → "rgba(255, 0, 0, 1)"
 * toRgba('#ff0000', 0.5)       // → "rgba(255, 0, 0, 0.5)"
 * toRgba('rgba(10,20,30,0.2)', 0.9) // → "rgba(10, 20, 30, 0.2)"
 * toRgba('hsl(120, 100%, 50%)') // → "rgba(0, 255, 0, 1)"
 * toRgba('blue', 0.3)          // → "rgba(0, 0, 255, 0.3)"
 */
export function colorToRgba(inputColor, opacity = 1) {
  // Parse the input into a Color instance
  const parsed = Color(inputColor);

  // Extract the alpha channel from the parsed color (default is 1 if none was provided)
  const inputAlpha = parsed.alpha();

  // Determine which alpha to use:
  // - If the parsed color already had alpha < 1, keep that.
  // - Otherwise, use the provided opacity value.
  const finalAlpha = inputAlpha < 1 ? inputAlpha : opacity;

  // Set the computed alpha and return as "rgba(r, g, b, a)" string
  return parsed.alpha(finalAlpha).rgb().string();
}
