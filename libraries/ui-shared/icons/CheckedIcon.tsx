import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The checked icon component.
 */
const Checked = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="checked" {...props} />
);

export default Checked;
