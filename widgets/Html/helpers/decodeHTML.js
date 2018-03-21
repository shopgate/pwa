/**
 * Unescape HTML entities.
 * @param {string} input The escaped HTML.
 * @returns {string} The unescaped HTML.
 */
const decodeHTML = (input) => {
  const e = document.createElement('div');

  e.innerHTML = input;

  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
};

export default decodeHTML;
