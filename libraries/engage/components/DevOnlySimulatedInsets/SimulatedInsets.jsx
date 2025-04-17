import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getHasSimulatedSafeAreaInsets } from '@shopgate/engage/core/selectors';
import SimulatedInsetTop from './SimulatedInsetTop';
import SimulatedInsetBottom from './SimulatedInsetBottom';

/**
 * Persists the decision to highlight the insets.
 * @param {*} value The val
 */
const persistHighlightInsets = (value) => {
  localStorage.setItem('highlight_insets', JSON.stringify(value));
};

/**
 * Retrieves the decision to highlight the insets.
 * @returns {boolean}
 */
const getHighlightInsets = () => {
  const value = localStorage.getItem('highlight_insets');

  if (value === null) {
    return false;
  }

  return JSON.parse(value);
};

/**
 * Simulates iOS insets in development mode.
 * @param {Object} props THe component props.
 * @returns {JSX.Element}
 */
const SimulatedInsets = ({ children }) => {
  const hasSimulatedSafeAreaInsets = useSelector(getHasSimulatedSafeAreaInsets);

  const [highlightInsets, setHighlightInsets] = useState(getHighlightInsets());

  const handleOnSetHighlightInsets = useCallback((value) => {
    setHighlightInsets(value);
    persistHighlightInsets(value);
  }, []);

  if (!hasSimulatedSafeAreaInsets) {
    return children;
  }

  return (
    <>
      <SimulatedInsetTop
        highlightInset={highlightInsets}
        onSetHighlightInset={handleOnSetHighlightInsets}
      />
      {children}
      <SimulatedInsetBottom
        highlightInset={highlightInsets}
        onSetHighlightInset={handleOnSetHighlightInsets}
      />
    </>
  );
};

SimulatedInsets.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SimulatedInsets;
