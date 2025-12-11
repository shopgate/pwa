import React from 'react';
import PropTypes from 'prop-types';

/**
 * A placeholder for a translation key.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const Placeholder = props => props.children;

Placeholder.format = props => <Placeholder {...props} />;

Placeholder.propTypes = {
  children: PropTypes.node.isRequired,
  forKey: PropTypes.string.isRequired,
};

export default Placeholder;
