import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';

const classes = {
  container: css({
    position: 'fixed',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'var(--safe-area-inset-bottom)',
    width: '100%',
    zIndex: 10000000,
    pointerEvents: 'auto',
    transition: 'background 0.2s ease',
  }),
  containerHighlight: css({
    background: 'rgba(200, 200, 200, 0.9)',
  }),
  handle: css({
    width: 120,
    height: 3,
    borderRadius: 3,
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxSizing: 'content-box',
  }),
};

/**
 * Renders a simulated iOS bottom inset in development.
 * @param {Object} props The component props.
 * @param {boolean} props.highlightInset Whether the inset should be highlighted.
 * @param {Function} props.onSetHighlightInset Toggles if insets should be highlighted.
 * @returns {JSX.Element}
 */
const SimulatedInsetBottom = ({
  highlightInset,
  onSetHighlightInset,
}) => {
  const handleClick = useCallback(() => {
    onSetHighlightInset(!highlightInset);
  }, [highlightInset, onSetHighlightInset]);

  const containerClasses = useMemo(() => classNames(classes.container, {
    [classes.containerHighlight]: highlightInset,
  }), [highlightInset]);

  return (
    <div
      inert
      role="presentation"
      className={containerClasses}
      onClick={handleClick}
    >
      <div className={classes.handle} />
    </div>
  );
};

SimulatedInsetBottom.propTypes = {
  highlightInset: PropTypes.bool.isRequired,
  onSetHighlightInset: PropTypes.func.isRequired,
};

export default SimulatedInsetBottom;

