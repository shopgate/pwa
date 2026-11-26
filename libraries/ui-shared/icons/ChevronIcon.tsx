import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The chevron icon component.
 */
const Chevron = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="chevron" {...props} />
);

export default Chevron;
