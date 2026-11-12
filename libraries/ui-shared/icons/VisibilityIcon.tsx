import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The visibility icon component.
 * https://material.io/tools/icons/?icon=visibility&style=baseline
 */
const VisibilityIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="visibility" {...props} />
);

export default VisibilityIcon;
