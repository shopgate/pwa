import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The Person icon component
 *
 * @link https://fonts.google.com/icons?selected=Material+Icons:person
 */
const PersonIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="person" {...props} />
);

export default PersonIcon;
