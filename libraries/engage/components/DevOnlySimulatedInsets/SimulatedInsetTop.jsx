import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';
import { UIEvents } from '@shopgate/engage/core/events';

const classes = {
  container: css({
    position: 'fixed',
    top: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 'var(--safe-area-inset-top)',
    width: '100%',
    zIndex: 10000000,
    pointerEvents: 'auto',
    fontSize: '16px',
  }),
  containerHighlight: css({
    background: 'rgba(200, 200, 200, 0.9)',
  }),
  styleLight: css({
    color: 'white',
  }),
  styleDark: css({
    color: 'black',
  }),
  info: css({
    flex: 1,
    textAlign: 'center',
    fontWeight: 500,
  }),
  notch: css({
    flex: 1,
    background: 'black',
    height: 'calc(var(--safe-area-inset-top) - 16px)',
    maxWidth: 150,
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.5)',
  }),
};

/**
 * Creates a human readable time string to mimic the iOS clock.
 * @returns {string} The current time in a human readable format.
 */
const getTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Renders a simulated iOS top inset in development.
 * @param {Object} props The component props.
 * @param {boolean} props.highlightInset Whether the inset should be highlighted.
 * @param {Function} props.onSetHighlightInset Toggles if insets should be highlighted.
 * @returns {JSX.Element}
 */
const SimulatedInsetTop = ({
  highlightInset,
  onSetHighlightInset,
}) => {
  // State to hold the current time string for the status bar
  const [time, setTime] = useState(getTime());

  // Effect to update the time on regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime());
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Stete to hold the current iOS status bar style
  const [statusBarStyle, setStatusBarStyle] = useState('dark');

  // Register event listener for navigation bar style updates
  useEffect(() => {
    /**
     * Handles the update of the navigation bar style.
     * @param {Object} event The event payload.
     * @returns {void}
     */
    const update = event => setStatusBarStyle(event.statusBarStyle);

    UIEvents.addListener('devInternalUpdateNavigationBarStyle', update);

    return () => {
      UIEvents.removeListener('devInternalUpdateNavigationBarStyle', update);
    };
  }, []);

  const handleClick = useCallback(() => {
    onSetHighlightInset(!highlightInset);
  }, [highlightInset, onSetHighlightInset]);

  const containerClasses = useMemo(
    () => classNames(
      classes.container,
      statusBarStyle === 'dark' ? classes.styleDark : classes.styleLight, {
        [classes.containerHighlight]: highlightInset,
      }
    ),
    [highlightInset, statusBarStyle]
  );

  return (
    <div
      inert
      role="presentation"
      className={classNames(containerClasses)}
      onClick={handleClick}
    >
      <div className={classes.info}>{time}</div>
      <div className={classes.notch} />
      <div className={classes.info}>5G</div>
    </div>
  );
};

SimulatedInsetTop.propTypes = {
  highlightInset: PropTypes.bool.isRequired,
  onSetHighlightInset: PropTypes.func.isRequired,
};

export default SimulatedInsetTop;
