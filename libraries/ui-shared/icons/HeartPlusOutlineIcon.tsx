import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The heart plus outline icon component.
 */
const HeartPlusOutline = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="heartPlusOutline" {...props} />
);

export default HeartPlusOutline;
