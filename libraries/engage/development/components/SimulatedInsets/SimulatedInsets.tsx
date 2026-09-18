import { useCallback } from 'react';
import type { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLongPress } from '@shopgate/engage/core/hooks';
import {
  getAreSimulatedInsetsInjected,
  getIsInsetHighlightVisible,
} from '@shopgate/engage/development/selectors';
import { toggleInsetHighlight, toggleInsets } from '@shopgate/engage/development/action-creators';
import SimulatedInsetTop from './SimulatedInsetTop';
import SimulatedInsetBottom from './SimulatedInsetBottom';

export interface SimulatedInsetsProps {
  /**
   * The child components.
   */
  children: ReactNode;
}

/**
 * Simulates iOS insets in development mode.
 */
const SimulatedInsets = ({ children }: SimulatedInsetsProps) => {
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

export default SimulatedInsets;
