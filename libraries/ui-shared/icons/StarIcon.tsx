import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The star icon component
 */
const Star = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="star" {...props} />
);

export default Star;
