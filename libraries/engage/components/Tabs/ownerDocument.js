/**
 * @param {Object} node node
 * @returns {Object}
 */
export default function ownerDocument(node) {
  return (node && node.ownerDocument) || document;
}
