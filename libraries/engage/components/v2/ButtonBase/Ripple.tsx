import React, { useEffect, useLayoutEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import { RIPPLE_PRESS_MS, RIPPLE_RELEASE_MS } from './constants';
import type { RippleItem as RippleModel } from './hooks';

interface RippleNodeProps {
  rippleX: number;
  rippleY: number;
  rippleSize: number;
  in?: boolean;
  onExited?: () => void;
}

function RippleNode({
  rippleX,
  rippleY,
  rippleSize,
  in: inProp = true,
  onExited,
}: RippleNodeProps) {
  const { classes, cx } = useStyles();
  const [leaving, setLeaving] = useState(false);

  useLayoutEffect(() => {
    if (!inProp) {
      setLeaving(true);
    }
  }, [inProp]);

  useEffect(() => {
    if (!inProp && onExited) {
      const timeoutId = window.setTimeout(onExited, RIPPLE_RELEASE_MS);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    return undefined;
  }, [inProp, onExited]);

  return (
    <span
      className={cx(classes.ripple, classes.rippleVisible)}
      style={{
        width: rippleSize,
        height: rippleSize,
        top: -(rippleSize / 2) + rippleY,
        left: -(rippleSize / 2) + rippleX,
      }}
    >
      <span className={cx(classes.child, leaving && classes.childLeaving)} />
    </span>
  );
}

interface RippleProps {
  ripples: RippleModel[];
}

/**
 * The Ripple component renders the ripple effect for button interactions.
 */
function Ripple({ ripples }: RippleProps) {
  const { classes } = useStyles();

  return (
    <span className={classes.container}>
      <TransitionGroup component={null} exit>
        {ripples.map(ripple => (
          <RippleNode
            key={ripple.key}
            rippleX={ripple.x}
            rippleY={ripple.y}
            rippleSize={ripple.size}
          />
        ))}
      </TransitionGroup>
    </span>
  );
}

const enterKeyframe = keyframes({
  '0%': {
    transform: 'scale(0)',
    opacity: 0.1,
  },
  '100%': {
    transform: 'scale(1)',
    opacity: 0.3,
  },
});

const exitKeyframe = keyframes({
  '0%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
});

const useStyles = makeStyles({
  name: 'ButtonBaseRipple',
})(() => ({
  container: {
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 0,
    inset: 0,
    borderRadius: 'inherit',
  },
  ripple: {
    opacity: 0,
    position: 'absolute',
  },
  rippleVisible: {
    opacity: 0.3,
    transform: 'scale(1)',
    animation: `${enterKeyframe} ${RIPPLE_PRESS_MS}ms ease-in-out`,
  },
  child: {
    opacity: 1,
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  childLeaving: {
    opacity: 0,
    animation: `${exitKeyframe} ${RIPPLE_RELEASE_MS}ms ease-in-out`,
  },
}));

export default Ripple;
