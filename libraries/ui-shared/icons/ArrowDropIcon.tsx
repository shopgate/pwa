import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The arrow-drop icon component.
 */
const ArrowDrop = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="arrowDrop" {...props} />
);

export default ArrowDrop;
