/**
 * Converts a string which might contain HTML markup or HTML entities into plain text.
 * Tags are stripped and entities are decoded. The input is parsed within an inert document
 * created by DOMParser, so scripts are not executed and no resources are loaded.
 * @param {string} input The input string.
 * @returns {string} The plain text.
 */
const htmlToText = (input) => {
  if (typeof input !== 'string' || input === '') {
    return '';
  }

  const doc = new DOMParser().parseFromString(input, 'text/html');

  return doc.body?.textContent ?? '';
};

export default htmlToText;
