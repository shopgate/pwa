const spacingUnit = 8;

/**
 * Returns spacing values in pixels. Accepts multiple numbers.
 * @param {...number} args - One or more spacing factors (e.g. 1, 2).
 * @returns {string} A space-separated string of pixel values (e.g. "8px 16px").
 */
export const spacing = (...args) => args.map(factor => `${factor * spacingUnit}px`).join(' ');
