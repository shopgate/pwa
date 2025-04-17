import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { css } from 'glamor';
import { getIsInsetHighlightVisible, getStatusBarStyleStorage } from '@shopgate/engage/development/selectors';
import { toggleInsetHighlight } from '@shopgate/engage/development/action-creators';

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
 * @returns {JSX.Element}
 */
const SimulatedInsetTop = () => {
  // State to hold the current time string for the status bar
  const [time, setTime] = useState(getTime());

  // Effect to update the time on regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime());
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, []);

  const dispatch = useDispatch();
  const highlightInset = useSelector(getIsInsetHighlightVisible);

  const handleClick = useCallback(() => {
    dispatch(toggleInsetHighlight(!highlightInset));
  }, [dispatch, highlightInset]);

  const { statusBarStyle } = useSelector(getStatusBarStyleStorage);

  const containerClasses = useMemo(
    () => classNames(classes.container, {
      [classes.containerHighlight]: highlightInset,
      [classes.styleDark]: statusBarStyle === 'dark',
      [classes.styleLight]: statusBarStyle === 'light',
    }),
    [highlightInset, statusBarStyle]
  );

  return (
    <div
      aria-hidden
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

export default SimulatedInsetTop;
