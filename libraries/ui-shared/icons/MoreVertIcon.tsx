import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The more vertical icon component.
 */
const MoreVert = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="moreVert" {...props} />
);

export default MoreVert;
