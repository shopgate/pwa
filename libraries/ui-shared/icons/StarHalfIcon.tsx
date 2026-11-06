import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The half-filled star icon component
 */
const StarHalfIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="starHalf" {...props} />
);

export default StarHalfIcon;
