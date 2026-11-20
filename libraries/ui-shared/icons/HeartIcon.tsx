import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The heart icon component.
 */
const Heart = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="heart" {...props} />
);

export default Heart;
