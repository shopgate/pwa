import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The heart-outline icon component.
 */
const HeartOutline = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="heartOutline" {...props} />
);

export default HeartOutline;
