import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The view list icon component.
 */
const ViewList = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="viewList" {...props} />
);

export default ViewList;
