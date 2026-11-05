import { makeStyles, keyframes } from '@shopgate/engage/styles';

const sweep = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(250%)' },
});

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'relative',
    height: 2,
    overflow: 'hidden',
    color: theme.palette.primary.main,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '40%',
      background: 'currentColor',
      opacity: 0.6,
    },
    '@media (prefers-reduced-motion: no-preference)': {
      '&::before': {
        animation: `${sweep} 1.1s ease-in-out infinite`,
      },
    },
  },
}));

/**
 * The loading line of the category drawer.
 * @param props The component props.
 * @param props.className The stable class of the line.
 * @returns The line.
 */
const LoadingBar = ({ className }: { className: string }) => {
  const { classes, cx } = useStyles();
  return <div className={cx(classes.root, className)} aria-hidden />;
};

export default LoadingBar;
