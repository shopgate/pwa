import ownerDocument from './ownerDocument';

/**
 * @param {Object} node node
 * @returns {Object}
 */
export default function ownerWindow(node) {
  const doc = ownerDocument(node);
  return doc.defaultView || window;
}
