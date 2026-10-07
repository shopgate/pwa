import { makeStyles, keyframes } from '@shopgate/engage/styles';
import useVariantSelectorSettings from '../../hooks/useVariantSelectorSettings';

const pulse = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
});

const ROWS = 2;
const VALUES = 4;

const useStyles = makeStyles({ name: 'VariantSelectorSkeleton' })(theme => ({
  block: {
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.emphasized,
    animation: `${pulse} 1.5s ease-in-out infinite`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
  row: {
    minHeight: 60,
    margin: theme.spacing(0, 2, 1.5),
  },
  heading: {
    width: 96,
    height: 20,
    margin: theme.spacing(0.5, 2, 1.5),
  },
  values: {
    display: 'flex',
    gap: theme.spacing(1),
    margin: theme.spacing(0, 2, 2),
  },
  value: {
    width: 56,
    height: 40,
  },
}));

/**
 * Placeholder for the variant selector while the variants are loading.
 * @returns The skeleton.
 */
const VariantSelectorSkeleton = () => {
  const { classes, cx } = useStyles();
  const { type, swatchCharacteristics } = useVariantSelectorSettings();
  const inline = type === 'chips' || swatchCharacteristics.length > 0;

  return (
    <div
      className="engage__variant-selector__skeleton"
      role="status"
      aria-busy="true"
    >
      {Array.from({ length: ROWS }, (_, row) => (inline ? [
        <div key={`heading-${row}`} className={cx(classes.block, classes.heading)} />,
        <div key={`values-${row}`} className={cx(classes.values, 'engage__variant-selector__skeleton-row')}>
          {Array.from({ length: VALUES }, (__, value) => (
            <span key={value} className={cx(classes.block, classes.value)} />
          ))}
        </div>,
      ] : (
        <div key={row} className={cx(classes.block, classes.row, 'engage__variant-selector__skeleton-row')} />
      )))}
    </div>
  );
};

export default VariantSelectorSkeleton;
