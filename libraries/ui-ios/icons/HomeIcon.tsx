import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The home icon component.
 */
const Home = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="home" {...props} />
);

export default Home;
