import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useLongPress } from '@shopgate/engage/core/hooks';
import {
  getAreSimulatedInsetsInjected,
  getIsInsetHighlightVisible,
} from '@shopgate/engage/development/selectors';
import { toggleInsetHighlight, toggleInsets } from '@shopgate/engage/development/action-creators';
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

  const dispatch = useDispatch();
  const highlightInset = useSelector(getIsInsetHighlightVisible);

  const handleClick = useCallback(() => {
    dispatch(toggleInsetHighlight(!highlightInset));
  }, [dispatch, highlightInset]);

  const attrs = useLongPress(() => {
    dispatch(toggleInsets(!hasSimulatedSafeAreaInsets));
  });

  return (
    <>
      {hasSimulatedSafeAreaInsets && (
        <SimulatedInsetTop
          onClick={handleClick}
          highlightInset={highlightInset}
          {...attrs}
        />
      )}
      {children}
      {hasSimulatedSafeAreaInsets && (
        <SimulatedInsetBottom
          onClick={handleClick}
          highlightInset={highlightInset}
          {...attrs}
        />
      )}
    </>
  );
};

SimulatedInsets.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SimulatedInsets;
