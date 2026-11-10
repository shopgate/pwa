import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The FlashOn icon component.
 */
const FlashEnabled = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="flashEnabled" {...props} />
);

export default FlashEnabled;
