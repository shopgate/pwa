import React from 'react';
import ResponsiveContainer from '@shopgate/engage/components/ResponsiveContainer';
import { css } from 'glamor';

const brandingColorBanner = css({
  position: 'fixed',
  backgroundColor: 'var(--color-background-gutter-header, var(--color-primary))',
  left: 0,
  right: 0,
  height: 288,
});

/**
 * The Viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const BrandingColorBanner = () => (
  <ResponsiveContainer breakpoint=">xs" webOnly>
    <div className={brandingColorBanner} />
  </ResponsiveContainer>
);

export default BrandingColorBanner;
