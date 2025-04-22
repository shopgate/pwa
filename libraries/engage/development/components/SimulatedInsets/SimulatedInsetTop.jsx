import React, {
  useState, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { css } from 'glamor';
import { getStatusBarStyleStorage } from '@shopgate/engage/development/selectors';

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
    transition: 'background 0.2s ease',
    fontSize: '16px',
  }),
  containerHighlight: css({
    background: 'rgba(255, 0, 0, 0.7)',
  }),
  styleLight: css({
    color: 'white',
  }),
  styleDark: css({
    color: 'black',
  }),
  styleNone: css({
    color: 'transparent',
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
 * @param {boolean} props.highlightInset Whether the inset is highlighted.
 * @param {Function} props.onClick The function to call when the inset is clicked.
 * @returns {JSX.Element}
 */
const SimulatedInsetTop = ({
  highlightInset,
  onClick,
  ...props
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

  const { statusBarStyle } = useSelector(getStatusBarStyleStorage);

  const containerClasses = useMemo(
    () => classNames(classes.container, {
      [classes.containerHighlight]: highlightInset,
      [classes.styleDark]: statusBarStyle === 'dark',
      [classes.styleLight]: statusBarStyle === 'light',
      [classes.styleNone]: statusBarStyle === 'none',
    }),
    [highlightInset, statusBarStyle]
  );

  return (
    <div
      aria-hidden
      role="presentation"
      className={classNames(containerClasses)}
      {...props}
      onClick={onClick}
    >
      <div className={classes.info}>{time}</div>
      <div className={classes.notch} />
      <div className={classes.info}>5G</div>
    </div>
  );
};

SimulatedInsetTop.propTypes = {
  highlightInset: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SimulatedInsetTop;
