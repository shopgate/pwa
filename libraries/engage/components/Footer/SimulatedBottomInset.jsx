import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { css } from 'glamor';
import { getHasSimulatedSafeAreaInsets } from '@shopgate/engage/core/selectors';

const classes = {
  insetContainer: css({
    position: 'fixed',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'var(--safe-area-inset-bottom)',
    width: '100%',
    zIndex: 10000000,
    pointerEvents: 'auto',
    // boxSizing: 'border-box',
    transition: 'background 0.2s ease',
  }),
  insetContainerHighlight: css({
    background: 'rgba(200, 200, 200, 0.9)',
  }),
  insetHandle: css({
    width: 120,
    height: 3,
    borderRadius: 3,
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxSizing: 'content-box',
  }),
};

/**
 * Persists the decision to highlight the inset.
 * @param {*} value The val
 */
const persistHighlightInset = (value) => {
  localStorage.setItem('highlight_inset', JSON.stringify(value));
};

/**
 * Retrieves the decision to highlight the inset.
 * @returns {boolean}
 */
const getHighlightInset = () => {
  const value = localStorage.getItem('highlight_inset');

  if (value === null) {
    return false;
  }

  return JSON.parse(value);
};

/**
 * Renders a simulated iOS bottom inset in development when user agent is set to iOS device.
 * @returns {JSX.Element|null}
 */
const SimulatedBottomInset = () => {
  const [highlightInset, setHighlightInset] = useState(getHighlightInset());

  const hasSimulatedSafeAreaInsets = useSelector(getHasSimulatedSafeAreaInsets);

  const handleHandleClick = useCallback(() => {
    setHighlightInset((prev) => {
      persistHighlightInset(!prev);
      return !prev;
    });
  }, []);

  if (!hasSimulatedSafeAreaInsets) {
    return null;
  }

  return (
    <div
      className={classNames(
        classes.insetContainer,
        { [classes.insetContainerHighlight]: highlightInset }
      )}
      onClick={handleHandleClick}
      role="presentation"
    >
      <div className={classes.insetHandle} />
    </div>
  );
};

export default SimulatedBottomInset;

