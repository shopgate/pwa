import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The info icon component.
 */
const InfoIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="info" {...props} />
);

export default InfoIcon;
