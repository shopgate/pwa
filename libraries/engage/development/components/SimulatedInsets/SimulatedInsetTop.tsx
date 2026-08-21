import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { getStatusBarStyleStorage } from '@shopgate/engage/development/selectors';
import type { SimulatedInsetProps } from './types';

const useStyles = makeStyles()(theme => ({
  container: {
    position: 'fixed',
    top: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: theme.layout.safeArea.top,
    width: '100%',
    zIndex: 10000000,
    pointerEvents: 'auto',
    transition: 'background 0.2s ease',
    fontSize: theme.typography.body1.fontSize,
  },
  containerHighlight: {
    background: 'rgba(255, 0, 0, 0.7)',
  },
  styleLight: {
    color: 'white',
  },
  styleDark: {
    color: 'black',
  },
  styleNone: {
    color: 'transparent',
  },
  info: {
    flex: 1,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightMedium,
  },
  notch: {
    flex: 1,
    background: 'black',
    height: `calc(${theme.layout.safeArea.top} - 16px)`,
    maxWidth: 150,
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.5)',
  },
}));

/**
 * Creates a human readable time string to mimic the iOS clock.
 * @returns The current time in a human readable format.
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
 */
const SimulatedInsetTop = ({
  highlightInset,
  onClick,
  ...props
}: SimulatedInsetProps) => {
  const { classes, cx } = useStyles();
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
    () => cx(classes.container, {
      [classes.containerHighlight]: highlightInset,
      [classes.styleDark]: statusBarStyle === 'dark',
      [classes.styleLight]: statusBarStyle === 'light',
      [classes.styleNone]: statusBarStyle === 'none',
    }),
    [highlightInset, statusBarStyle, classes, cx]
  );

  return (
    <div
      aria-hidden
      role="presentation"
      className={containerClasses}
      {...props}
      onClick={onClick}
    >
      <div className={classes.info}>{time}</div>
      <div className={classes.notch} />
      <div className={classes.info}>5G</div>
    </div>
  );
};

export default SimulatedInsetTop;
