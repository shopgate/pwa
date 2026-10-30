import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The check icon component.
 */
const Check = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="check" {...props} />
);

export default Check;
