import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { css } from 'glamor';
import { getIsInsetHighlightVisible } from '@shopgate/engage/development/selectors';
import { toggleInsetHighlight } from '@shopgate/engage/development/action-creators';

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
    background: 'rgba(255, 0, 0, 0.5)',
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
 * @returns {JSX.Element}
 */
const SimulatedInsetBottom = () => {
  const dispatch = useDispatch();
  const highlightInset = useSelector(getIsInsetHighlightVisible);

  const handleClick = useCallback(() => {
    dispatch(toggleInsetHighlight(!highlightInset));
  }, [dispatch, highlightInset]);

  const containerClasses = useMemo(() => classNames(classes.container, {
    [classes.containerHighlight]: highlightInset,
  }), [highlightInset]);

  return (
    <div
      aria-hidden
      role="presentation"
      className={containerClasses}
      onClick={handleClick}
    >
      <div className={classes.handle} />
    </div>
  );
};

export default SimulatedInsetBottom;

