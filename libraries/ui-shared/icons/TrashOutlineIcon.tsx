import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The trash outline icon component.
 * @link https://fonts.google.com/icons?selected=Material+Icons:delete_outline:&icon.query=trash
 */
const TrashOutline = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="trashOutline" {...props} />
);

export default TrashOutline;
