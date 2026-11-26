import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The box icon component.
 */
const Box = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="box" {...props} />
);

export default Box;
