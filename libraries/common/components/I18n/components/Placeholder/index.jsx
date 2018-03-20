import React from 'react';
import PropTypes from 'prop-types';

/**
 * A placeholder for a translation key.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const Placeholder = props => (
  <span>
    {props.children}
  </span>
);

Placeholder.format = props => <Placeholder {...props} />;

Placeholder.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  forKey: PropTypes.string.isRequired,
};

export default Placeholder;
