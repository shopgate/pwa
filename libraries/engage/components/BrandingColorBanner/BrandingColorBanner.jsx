import React from 'react';
import ResponsiveContainer from '@shopgate/engage/components/ResponsiveContainer';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  brandingColorBanner: {
    position: 'fixed',
    backgroundColor: 'var(--color-background-gutter-header, var(--color-primary))',
    left: 0,
    right: 0,
    height: 288,
  },
});

/**
 * The Viewport component.
 * @returns {JSX}
 */
const BrandingColorBanner = () => {
  const { classes } = useStyles();

  return (
    <ResponsiveContainer breakpoint=">xs" webOnly>
      <div className={classes.brandingColorBanner} />
    </ResponsiveContainer>
  );
};

export default BrandingColorBanner;
