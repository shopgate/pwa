import React from 'react';
import PropTypes from 'prop-types';

/**
 * The Portlets component activates all the extension components that use portals.
 * @param {Object} props The component props.
 * @param {Array} props.components An array of react components.
 * @return {JSX}
 */
const Portlets = ({ components }) => {
  if (!components || !Object.keys(components).length) {
    return null;
  }

  return Object.keys(components).map((key) => {
    const Component = components[key];

    if (!Component || typeof Component !== 'function') {
      return null;
    }

    return <Component key={key} />;
  });
};

Portlets.propTypes = {
  components: PropTypes.shape(),
};

Portlets.defaultProps = {
  components: null,
};

export default Portlets;
