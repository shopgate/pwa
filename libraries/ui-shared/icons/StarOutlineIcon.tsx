import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The star-outline icon component.
 */
const StarOutline = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="starOutline" {...props} />
);

export default StarOutline;
