import PropTypes from 'prop-types';

/**
 * Conditionally wraps React children with another component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ConditionalWrapper = ({
  condition,
  wrapper,
  wrapperFalsy,
  children,
}) => {
  if (condition) {
    return wrapper(children);
  }

  return typeof wrapperFalsy === 'function' ? wrapperFalsy(children) : children;
};

ConditionalWrapper.propTypes = {
  /**
   * When set to `true`, the component children will be wrapped by the React component which is
   * defined in `wrapper`.
   * When the to `false`, the component children will be wrapped by the React component which is
   * optionally defined in `wrapperFalsy`.
   */
  condition: PropTypes.bool.isRequired,
  wrapper: PropTypes.elementType.isRequired,
  children: PropTypes.node,
  wrapperFalsy: PropTypes.elementType,
};

ConditionalWrapper.defaultProps = {
  children: null,
  wrapperFalsy: null,
};

export default ConditionalWrapper;
