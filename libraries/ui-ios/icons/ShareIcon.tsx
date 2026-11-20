import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The Share icon component.
 */
const ShareIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="share" {...props} />
);

export default ShareIcon;
