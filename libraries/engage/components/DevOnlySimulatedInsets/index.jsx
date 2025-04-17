import React from 'react';
import PropTypes from 'prop-types';
import { isDev } from '@shopgate/engage/core/helpers';
import SimulatedInsets from './SimulatedInsets';

/**
 * Simulates iOS insets in development mode.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const DevOnlySimulatedInsets = ({ children }) => {
  if (!isDev) {
    return children;
  }

  return (
    <SimulatedInsets>
      {children}
    </SimulatedInsets>
  );
};

DevOnlySimulatedInsets.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DevOnlySimulatedInsets;
