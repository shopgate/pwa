/**
 * Unescape HTML entities.
 * The input is assigned to a textarea element whose content is parsed as plain text, so markup
 * within the input is never turned into DOM nodes and can't execute scripts.
 * @param {string} input The escaped HTML.
 * @returns {string} The unescaped HTML.
 */
const decodeHTML = (input) => {
  const textarea = document.createElement('textarea');

  textarea.innerHTML = input;

  return textarea.value;
};

export default decodeHTML;
