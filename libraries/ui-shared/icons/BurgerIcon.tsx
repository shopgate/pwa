import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The burger icon component.
 */
const Burger = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="burger" {...props} />
);

export default Burger;
