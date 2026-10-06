import { makeStyles, keyframes } from '@shopgate/engage/styles';

const pulse = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
});

const ROWS = 2;

const useStyles = makeStyles({ name: 'VariantSelectorSkeleton' })(theme => ({
  row: {
    minHeight: 62,
    margin: theme.spacing(0, 2, 1.5),
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.emphasized,
    animation: `${pulse} 1.5s ease-in-out infinite`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
}));

/**
 * Placeholder for the variant selector while the variants are loading.
 * @returns The skeleton.
 */
const VariantSelectorSkeleton = () => {
  const { classes, cx } = useStyles();

  return (
    <div
      className="engage__variant-selector__skeleton"
      aria-busy="true"
      data-testid="variant-selector-skeleton"
    >
      {Array.from({ length: ROWS }, (_, index) => (
        <div key={index} className={cx(classes.row, 'engage__variant-selector__skeleton-row')} />
      ))}
    </div>
  );
};

export default VariantSelectorSkeleton;
