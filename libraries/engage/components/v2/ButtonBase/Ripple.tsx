import { useEffect, useLayoutEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import { RIPPLE_PRESS_MS, RIPPLE_RELEASE_MS } from './constants';

const useEnhancedEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const rippleEnter = keyframes({
  '0%': {
    transform: 'scale(0)',
    opacity: 0.1,
  },
  '100%': {
    transform: 'scale(1)',
    opacity: 0.18,
  },
});

const rippleExit = keyframes({
  '0%': {
    opacity: 0.18,
  },
  '100%': {
    opacity: 0,
  },
});

const useStyles = makeStyles({
  name: 'ButtonBaseRipple',
})(() => ({
  container: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  },
  ripple: {
    position: 'absolute',
    opacity: 0,
    transform: 'scale(1)',
  },
  rippleVisible: {
    opacity: 0.18,
    animation: `${rippleEnter} ${RIPPLE_PRESS_MS}ms ease-out forwards`,
  },
  child: {
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  childLeaving: {
    animation: `${rippleExit} ${RIPPLE_RELEASE_MS}ms ease-out forwards`,
  },
}));

type RippleModel = {
  key: number;
  x: number;
  y: number;
  size: number;
};

interface RippleItemProps {
  rippleX: number;
  rippleY: number;
  rippleSize: number;
  in?: boolean;
  onExited?: () => void;
}

function RippleItem({
  rippleX,
  rippleY,
  rippleSize,
  in: inProp,
  onExited,
}: RippleItemProps) {
  const { classes, cx } = useStyles();
  const [leaving, setLeaving] = useState(false);

  useEnhancedEffect(() => {
    if (inProp === false) {
      setLeaving(true);

      const timeoutId = window.setTimeout(() => {
        onExited?.();
      }, RIPPLE_RELEASE_MS);

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

/**
 * The Ripple component renders the ripple effect for button interactions.
 */
function Ripple({ ripples }: { ripples: RippleModel[] }) {
  const { classes } = useStyles();

  return (
    <span className={classes.container}>
      <TransitionGroup component={null}>
        {ripples.map(ripple => (
          <RippleItem
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

export default Ripple;
