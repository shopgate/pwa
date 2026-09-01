import { useMemo } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import type { SimulatedInsetProps } from './types';

const useStyles = makeStyles()(theme => ({
  container: {
    position: 'fixed',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.layout.safeArea.bottom,
    width: '100%',
    zIndex: 10000000,
    pointerEvents: 'auto',
    transition: 'background 0.2s ease',
  },
  containerHighlight: {
    background: 'rgba(255, 0, 0, 0.7)',
  },
  handle: {
    width: 120,
    height: 3,
    borderRadius: 3,
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxSizing: 'content-box',
  },
}));

/**
 * Renders a simulated iOS bottom inset in development.
 */
const SimulatedInsetBottom = ({
  highlightInset,
  onClick,
  ...props
}: SimulatedInsetProps) => {
  const { classes, cx } = useStyles();
  const containerClasses = useMemo(() => cx(classes.container, {
    [classes.containerHighlight]: highlightInset,
  }), [highlightInset, classes.container, classes.containerHighlight, cx]);

  return (
    <div
      aria-hidden
      role="presentation"
      className={containerClasses}
      {...props}
      onClick={onClick}
    >
      <div className={classes.handle} />
    </div>
  );
};

export default SimulatedInsetBottom;
