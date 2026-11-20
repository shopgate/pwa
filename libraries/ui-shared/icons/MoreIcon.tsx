import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The more icon component.
 */
const More = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="more" {...props} />
);

export default More;
