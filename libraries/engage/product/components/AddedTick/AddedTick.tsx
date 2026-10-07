import TickIcon from '@shopgate/pwa-ui-shared/icons/TickIcon';
import { keyframes, makeStyles } from '@shopgate/engage/styles';

export interface AddedTickProps {
  className?: string;
}

const tickIn = keyframes({
  '0%': {
    transform: 'scale(0.3)',
    opacity: 0,
  },
  '60%': {
    transform: 'scale(1.15)',
    opacity: 1,
  },
  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
});

const useStyles = makeStyles({ name: 'AddedTick' })(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: `${tickIn} 400ms ${theme.transitions.easing.easeOut}`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
}));

/**
 * The tick an add to cart button shows after the product was added.
 * @returns The tick.
 */
const AddedTick = ({ className }: AddedTickProps) => {
  const { classes, cx } = useStyles();

  return (
    <span className={cx(classes.root, 'engage__added-tick', className)} aria-hidden>
      <TickIcon />
    </span>
  );
};

export default AddedTick;
