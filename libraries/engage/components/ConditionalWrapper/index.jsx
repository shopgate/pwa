/**
 * Conditionally wraps React children with another component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ConditionalWrapper = ({ condition, wrapper, children }) =>
  (condition ? wrapper(children) : children);

export default ConditionalWrapper;
