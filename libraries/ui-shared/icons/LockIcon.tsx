import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The lock icon component.
 * @link https://material.io/tools/icons/?icon=lock&style=baseline
 *
 */
const LockIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="lock" {...props} />
);

export default LockIcon;
