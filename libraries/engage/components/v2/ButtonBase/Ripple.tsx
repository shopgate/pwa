import { makeStyles, keyframes } from '@shopgate/engage/styles';

const rippleAnimation = keyframes({
  to: {
    transform: 'scale(4)',
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
    borderRadius: '50%',
    transform: 'scale(0)',
    backgroundColor: 'currentColor',
    opacity: 0.2,
    animation: `${rippleAnimation} 550ms ease-out`,
  },
}));

interface RippleProps {
  ripples: {
    key: number;
    x: number;
    y: number;
    size: number;
  }[];
}

/**
 * The Ripple component renders the ripple effect for button interactions.
 */
const Ripple = (props: RippleProps) => {
  const { ripples } = props;

  const { classes } = useStyles();

  return (
    <span className={classes.container}>
      {ripples.map(r => (
        <span
          key={r.key}
          className={classes.ripple}
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
};

export default Ripple;
