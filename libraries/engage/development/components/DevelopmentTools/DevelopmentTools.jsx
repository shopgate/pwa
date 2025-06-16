import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isDev } from '@shopgate/engage/core/helpers';
import Shortcuts from './Shortcuts';
import SimulatedInsets from '../SimulatedInsets';

/**
 * Provides development tools for the app.
 * @param {Object} props The component props.
 * @param {React.ReactNode} props.children The child components.
 * @returns {JSX.Element}
 */
const DevelopmentTools = ({ children }) => {
  if (!isDev) {
    return children;
  }

  return (
    <>
      <Shortcuts />
      <SimulatedInsets>
        {children}
      </SimulatedInsets>
    </>
  );
};

DevelopmentTools.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(DevelopmentTools);
