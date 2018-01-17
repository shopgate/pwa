import React from 'react';
import PropTypes from 'prop-types';

/**
 * The Target component.
 * It defines a DOM element where portal can connect to.
 * It also can define a replaceable portal.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Target = (props) => {
  const {
    id,
    replaceable = false,
    as,
    identifier,
    children,
  } = props;

  const targetProps = {
    'data-key': id,
    'data-id': identifier,
  };

  if (!replaceable) {
    return <div {...targetProps} />;
  }

  return React.createElement(as, targetProps, children);
};

Target.propTypes = {
  id: PropTypes.string.isRequired,
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  children: PropTypes.node,
  identifier: PropTypes.string,
  replaceable: PropTypes.bool,
};

Target.defaultProps = {
  as: 'div',
  children: null,
  identifier: null,
  replaceable: false,
};

export default Target;
