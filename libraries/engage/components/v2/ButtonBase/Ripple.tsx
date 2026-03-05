import { makeStyles, keyframes } from '@shopgate/engage/styles';
import { RIPPLE_PRESS_MS, RIPPLE_RELEASE_MS } from './constants';

const ripplePress = keyframes({
  to: { transform: 'scale(2.5)' },
});

const rippleRelease = keyframes({
  to: { opacity: 0 },
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
  rippleBase: {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    opacity: 0.18,
    transform: 'scale(0)',
    willChange: 'transform, opacity',
  },
  pressing: {
    animation: `${ripplePress} ${RIPPLE_PRESS_MS}ms ease-out forwards`,
  },
  releasing: {
    // keep scale, fade out
    animation: `${rippleRelease} ${RIPPLE_RELEASE_MS}ms ease-out forwards`,
  },
}));

type RippleModel = {
  key: number;
  x: number;
  y: number;
  size: number;
  state: 'pressing' | 'releasing';
};

/**
 * The Ripple component renders the ripple effect for button interactions.
 */
export function Ripple({ ripples }: { ripples: RippleModel[] }) {
  const { classes, cx } = useStyles();

  return (
    <span className={classes.container}>
      {ripples.map(r => (
        <span
          key={r.key}
          className={cx(
            classes.rippleBase,
            r.state === 'pressing' ? classes.pressing : classes.releasing
          )}
          style={{
            width: r.size,
            height: r.size,
            left: r.x,
            top: r.y,
          }}
        />
      ))}
    </span>
  );
}

export default Ripple;
