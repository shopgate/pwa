import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The add more icon component.
 */
const AddMore = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="addMore" {...props} />
);

export default AddMore;
