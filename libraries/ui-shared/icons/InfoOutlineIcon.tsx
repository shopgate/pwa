import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The info outline icon component.
 */
const InfoOutline = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="infoOutline" {...props} />
);

export default InfoOutline;
