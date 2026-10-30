import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The unchecked icon component.
 */
const Unchecked = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="unchecked" {...props} />
);

export default Unchecked;
