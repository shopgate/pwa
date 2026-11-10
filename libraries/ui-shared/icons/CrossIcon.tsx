import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The cross icon component.
 */
const Cross = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="cross" {...props} />
);

export default Cross;
