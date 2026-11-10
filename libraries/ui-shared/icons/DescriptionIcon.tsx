import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The description icon component.
 */
const Description = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="description" {...props} />
);

export default Description;
