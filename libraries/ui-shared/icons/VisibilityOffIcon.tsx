import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The visibility off icon component.
 * https://material.io/tools/icons/?icon=visibility_off&style=baseline
 */
const VisibilityOffIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="visibilityOff" {...props} />
);

export default VisibilityOffIcon;
