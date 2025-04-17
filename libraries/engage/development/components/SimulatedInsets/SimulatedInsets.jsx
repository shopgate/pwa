import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getAreSimulatedInsetsInjected } from '@shopgate/engage/development/selectors';
import SimulatedInsetTop from './SimulatedInsetTop';
import SimulatedInsetBottom from './SimulatedInsetBottom';

/**
 * Simulates iOS insets in development mode.
 * @param {Object} props The component props.
 * @param {React.ReactNode} props.children The child components.
 * @returns {JSX.Element}
 */
const SimulatedInsets = ({ children }) => {
  const hasSimulatedSafeAreaInsets = useSelector(getAreSimulatedInsetsInjected);

  return (
    <>
      {hasSimulatedSafeAreaInsets && <SimulatedInsetTop />}
      {children}
      {hasSimulatedSafeAreaInsets && <SimulatedInsetBottom />}
    </>
  );
};

SimulatedInsets.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SimulatedInsets;
