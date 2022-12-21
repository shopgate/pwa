/**
 * Takes a string and converts it to a part to be used in a portal name
 * @package FormBuilder
 * @param {string} s The string to be sanitized
 * @return {string}
 */
export const sanitizePortalName = s => s.replace(/[\\._]/, '-');
