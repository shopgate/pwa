/**
 * Encodes an SVG to create a data image url
 * @param {string} SVG the full SVG
 * @returns {string|null} data image url
 */
export const encodeSVG = (SVG) => {
  if (!SVG) {
    return null;
  }

  // SVG overwrite configured -> create data url
  try {
    // encode SVG string to UTF-8 byte array to handle non-Latin1 characters
    // (e.g. Unicode characters like emojis)
    const utf8Encoder = new TextEncoder();
    const svgBytes = utf8Encoder.encode(SVG);

    // Convert the byte array to a Base64 string
    const base64Svg = btoa(String.fromCharCode.apply(null, svgBytes));

    return `data:image/svg+xml;base64,${base64Svg}`;
  } catch (e) {
    return null;
  }
};
