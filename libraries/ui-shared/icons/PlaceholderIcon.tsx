import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The placeholder icon component.
 */
const Placeholder = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="placeholder" {...props} />
);

export default Placeholder;
