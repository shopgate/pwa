/**
 * Converts a raw SVG markup string into a Base64-encoded data URL
 * @param {string} svg the SVG which should be converted
 * @param {string} [fallbackSVG] the fallback SVG in case the first isn't available
 * @returns {string|null} data URL
 */
export const svgToDataUrl = (svg, fallbackSVG) => {
  if (!svg) {
    return fallbackSVG || null;
  }

  try {
    // encode svg string to UTF-8 byte array to handle non-Latin1 characters
    // (e.g. Unicode characters like emojis)
    const utf8Encoder = new TextEncoder();
    const svgBytes = utf8Encoder.encode(svg);

    // Convert the byte array to a Base64 string
    const base64Svg = btoa(String.fromCharCode.apply(null, svgBytes));

    return `data:image/svg+xml;base64,${base64Svg}`;
  } catch (e) {
    return fallbackSVG || null;
  }
};
