import React from 'react';
import { makeStyles, keyframes } from '@shopgate/engage/styles';

const pulse = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
});

const useStyles = makeStyles({ name: 'VariantSelectorSkeleton' })(theme => ({
  root: {
    minHeight: 56,
    margin: '0 16px 12px',
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
      className={cx(classes.root, 'engage__variant-selector__skeleton')}
      aria-busy="true"
      data-testid="variant-selector-skeleton"
    />
  );
};

export default VariantSelectorSkeleton;
