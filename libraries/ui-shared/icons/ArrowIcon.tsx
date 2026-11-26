import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

export interface ArrowIconProps extends Omit<ThemeIconProps, 'name'> {
  shadow?: boolean;
}

/**
 * The arrow icon component.
 */
const ArrowIcon = ({ shadow = false, ...props }: ArrowIconProps) => (
  <ThemeIcon name={shadow ? 'arrowShadowed' : 'arrow'} {...props} />
);

export default ArrowIcon;
