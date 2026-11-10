import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The locator icon component.
 */
const Locator = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="locator" {...props} />
);

export default Locator;
