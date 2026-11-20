import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The FlashOff icon component.
 */
const FlashDisabled = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="flashDisabled" {...props} />
);

export default FlashDisabled;
